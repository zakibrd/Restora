

from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import *

router= DefaultRouter()
router.register(r'menuitem',MenuitemViewSet,basename='menuitem')
router.register(r'category',CategoryViewSet,basename='category')
router.register(r'table',TableViewSet,basename='table')
router.register(r'orders', OrderViewSet,basename='orders')
urlpatterns = [
   path('orders/create/', create_order, name='create_order'),
   path('login/', login_view, name='login'),
   path('logout/', logout_view, name='logout'),
   path('me/', me_view, name='me'),
   path('table/<int:table_id>/qr/', generate_table_qr, name='generate-table-qr'),
   path ('',include(router.urls) ),
]
