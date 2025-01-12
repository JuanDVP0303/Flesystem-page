from django.contrib import admin
from .models import Inventory, Product, ProductVariants, Movement, ProductBatch
admin.site.register(Inventory)
admin.site.register(Product)
admin.site.register(ProductVariants)
admin.site.register(Movement)
admin.site.register(ProductBatch)
# Register your models here.
