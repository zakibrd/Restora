from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
class Restaurant(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name


class User(AbstractUser):
     ROLE_CHOICES = [
        ("admin", "Admin"),
        ("cashier", "Cashier"),
    ]
     restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name="users", null=True, blank=True)
     role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="cashier")
     

class Table(models.Model):
      STATUS_CHOICES = [
            ('empty', 'Empty'),
            ('occupied', 'Occupied'),
            ('new_order', 'New Order'),
        ]
      restaurant = models.ForeignKey(Restaurant,on_delete=models.CASCADE,related_name='tables')
      number= models.PositiveIntegerField()
      token = models.CharField(max_length=20 , unique=True)
      active = models.BooleanField(default=True)
      status = models.CharField(max_length=20 , choices=STATUS_CHOICES ,default='empty')
     
 
      class Meta :
        unique_together = ('restaurant','number')

      def __str__(self):
        return f"Table {self.number}-{self.restaurant.name}"


class Category(models.Model):
        restaurant = models.ForeignKey(Restaurant,on_delete=models.CASCADE,related_name='categories')
        name = models.CharField(max_length=100)
        order = models.PositiveIntegerField(default=0)

        class Meta :
             ordering = ['order']


        def __str__(self):
           return self.name


class Menuitem(models.Model):
     category = models.ForeignKey(Category, on_delete=models.CASCADE,related_name='items')
     name= models.CharField(max_length=150)
     description= models.TextField(blank=True)
     price = models.DecimalField(max_digits=8,decimal_places=2)
     available = models.BooleanField(default=True)

     def __str__(self):
          return self.name

class TableSession(models.Model):
      STATUS_CHOICES = [
        ("open", "Open"),
        ("closed", "Closed"),
       ]

      table = models.ForeignKey(Table, on_delete=models.CASCADE,related_name='sessions')
      status = models.CharField(max_length=20 ,choices=STATUS_CHOICES,default='open')
      opened_at = models.DateTimeField(auto_now_add=True)
      closed_at = models.DateTimeField(null=True, blank=True)

      def __str__(self):
           return f"Session #{self.id} - Table {self.table.number} ({self.status})"


class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
       ]
    table_session= models.ForeignKey(TableSession,on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES,default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)


    class Meta :
         ordering = ['-created_at']

    def __str__(self):
         return f"Order #{self.id} ({self.status})"

    @property
    def total(self):
         return sum(item.subtotal for item in self.items.all())


class OrderItem(models.Model):
     order= models.ForeignKey(Order, on_delete=models.CASCADE,related_name='items')
     menu_item=models.ForeignKey(Menuitem, on_delete=models.PROTECT)
     quantity = models.PositiveIntegerField(default=1)
     unit_price = models.DecimalField(max_digits=8, decimal_places=2)

     @property
     def subtotal(self):
          return self.unit_price * self.quantity

     def __str__(self):
          return f"{self.quantity} X {self.menu_item.name}"


class PrintJob(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("printing", "Printing"),
        ("printed", "Printed"),
        ("failed", "Failed"),
    ]
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="print_jobs")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    attempts = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    claimed_at = models.DateTimeField(null=True, blank=True)
    printed_at = models.DateTimeField(null=True, blank=True)
    error = models.TextField(blank=True)

    def __str__(self):
        return f"PrintJob #{self.id} for Order #{self.order_id} ({self.status})"