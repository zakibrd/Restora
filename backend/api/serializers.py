from rest_framework import serializers
from .models import *

class MenuitemSerializer(serializers.ModelSerializer):
    class Meta :
        model= Menuitem
        fields = ["id", "name", "description", "price", "available","category"]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'restaurant']

class CategorySerializer(serializers.ModelSerializer):
    items = MenuitemSerializer(many=True , read_only=True)
    class Meta :
        model = Category
        fields = ["id", "name", "order", "items"]      


class OrderItemSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='menu_item.name',read_only=True)
    subtotal = serializers.DecimalField(max_digits=8,decimal_places=2 ,read_only=True)
    unit_price = serializers.DecimalField(
        max_digits=8, decimal_places=2, coerce_to_string=False
    )
    class Meta :
        model = OrderItem
        fields = ["id", "menu_item", "name", "quantity", "unit_price", "subtotal"]



class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True , read_only= True)
    total = serializers.DecimalField(max_digits=8,decimal_places=2,read_only=True,coerce_to_string=False)
    table_number = serializers.IntegerField(source='table_session.table.number', read_only=True)
    class Meta :
        model = Order
        fields = ["id", "table_session", "table_number", "status", "created_at", "completed_at", "items", "total"]


class TableSerializer(serializers.ModelSerializer):

    orders = serializers.SerializerMethodField()

    class Meta:
        model = Table
        fields = ["id", "number", "token", "active", 'status', 'orders']

    def get_orders(self, obj):
        session = obj.sessions.filter(status='open').first()
        if not session:
            return []
        # On renvoie TOUTES les commandes actives de la session (pas seulement la dernière),
        # triées de la plus ancienne à la plus récente, pour que chaque commande puisse
        # être affichée et acceptée indépendamment des autres.
        orders = (
            session.orders
            .exclude(status__in=['completed', 'cancelled'])
            .order_by('created_at')
        )
        return OrderSerializer(orders, many=True).data


class TableSessionSerializer(serializers.ModelSerializer):
    orders = OrderSerializer(many=True,read_only=True)
    table_number=serializers.IntegerField(source='table.number',read_only=True)

    class Meta :
        model = TableSession
        fields=["id", "table", "table_number", "status", "opened_at", "closed_at", "orders"]