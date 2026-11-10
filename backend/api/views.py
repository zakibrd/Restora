from django.shortcuts import render
from django.db.models import Prefetch
from django.db.models import Max
from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view,permission_classes,authentication_classes
from .serializers import *
from .models import *
from rest_framework.response import Response
from django.contrib.auth import authenticate, login,logout
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
import qrcode
from pathlib import Path

# Create your views here.


class MenuitemViewSet(viewsets.ModelViewSet):
    queryset = Menuitem.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class=MenuitemSerializer
    authentication_classes = []
    

        
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class=CategorySerializer
    authentication_classes=[]

    def perform_create(self, serializer):
        # 👈 Automatically supplies the required restaurant foreign key
        restaurant = Restaurant.objects.first()
        

        max_order =Category.objects.filter(restaurant=restaurant).aggregate(Max('order'))['order__max']
        next_order =(max_order+1) if not None else 1

        serializer.save(restaurant=restaurant, order= next_order)



class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class=TableSerializer
    authentication_classes = []
    def get_queryset(self):
        # Prefetch sessions and orders for better performance
        return Table.objects.prefetch_related(
            Prefetch('sessions', queryset=TableSession.objects.filter(status='open')),
            'sessions__orders',
            'sessions__orders__items',
            'sessions__orders__items__menu_item',
        ).order_by('number')

    
    
    def perform_update(self, serializer):
        table = serializer.save()
        
        # When table is freed, close all active open sessions
        if table.status in ['empty', 'libre']:
            table.sessions.filter(status='open').update(status='closed')

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []  # Bypasses CSRF checks causing 403s


        



@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
@ensure_csrf_cookie
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({'error':'Misssing credentials'},status=400)

    user = authenticate(request,username=username,password=password)

    if user:
        login(request,user)
        return Response(UserSerializer(user).data)
    return Response({'error':'Invalid credentials'},status=401)

@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def logout_view(request):
    logout(request)
    return Response({'message':'Logged out succesfully'},status=200)

@api_view (['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def me_view(request):
   if request.user.is_authenticated:
        return Response(UserSerializer(request.user).data)
   return Response(None)


@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def create_order(request):
    table_token = request.data.get('table_token')
    items_data = request.data.get('items')


    if not table_token:
        return Response({'error': 'table_token is required'},status=400)
    if not items_data:
        return Response({'error': 'items is required'},status=400)
    if not isinstance(items_data,list):
        return Response({'error': 'items must be a list '},status=400)

    try:
        table = Table.objects.get(token= table_token,active=True)
    except Table.DoesNotExist:
        return Response({'error': 'Invalid or inactive table'}, status=404)

    session = TableSession.objects.filter(table=table,status='open').first()
    if not session:
        session= TableSession.objects.create(table=table,status='open')


    order = Order.objects.create(
        table_session = session,
        status= 'pending'
    )
    created_items = []
    for item in items_data :
        menu_item_id=item.get('menu_item_id')
        quantity = item.get('quantity',1)

        if not menu_item_id:
            continue
        try:
            menu_item = Menuitem.objects.get(id=menu_item_id)
        except Menuitem.DoesNotExist:
            continue
        order_item = OrderItem.objects.create(
             order=order,
            menu_item=menu_item,
            quantity=quantity,
            unit_price=menu_item.price
        )
        created_items.append(order_item)


    if not created_items:
        order.delete()
        return Response({'error': 'No valid items provided'}, status=400)


    table.status='new_order'
    table.save(update_fields=['status'])

    serializer = OrderSerializer(order)
    return Response(serializer.data, status=201)



@api_view(['GET'])
def generate_table_qr(request, table_id):
    try:
        table = Table.objects.get(pk=table_id)
    except Table.DoesNotExist:
        return Response({"error": "Table non trouvée"}, status=status.HTTP_404_NOT_FOUND)

    # 1. Get host IP (e.g., 192.168.1.15)
    
    target_url = f"http://10.132.7.71:5173/?token={table.token}"

    # 2. Generate the QR Code matrix
    qr = qrcode.QRCode(version=1, box_size=8, border=2)
    qr.add_data(target_url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="#EA580C", back_color="#FFF7ED")

    # 3. Get Desktop directory path dynamically
    desktop_path = Path.home() / "Desktop"
    file_name = f"Table_{table.number}_QR.png"
    file_path = desktop_path / file_name

    # 4. Save file directly to Desktop
    img.save(file_path)

    return Response({
        "message": f"QR Code saved to Desktop successfully!",
        "file_path": str(file_path)
    }, status=status.HTTP_200_OK)