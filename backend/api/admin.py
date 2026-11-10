from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Restaurant, User, Table, Category, Menuitem, TableSession, Order, OrderItem, PrintJob

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("Custom Fields", {"fields": ("role", "restaurant")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Custom Fields", {"fields": ("role", "restaurant")}),
    )

admin.site.register(Restaurant)
admin.site.register(Table)
admin.site.register(Category)
admin.site.register(Menuitem)
admin.site.register(TableSession)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(PrintJob)