from django.shortcuts import render
from rest_framework import viewsets, status
from .models import Inventory, Product, Movement, ProductBatch
from .serializer import ProductBatchSerializer, ProductSerializer, MovementSerializer
from rest_framework.decorators import action
# from operators.models import Operator
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied
from rest_framework.exceptions import ValidationError
from datetime import datetime
from django.db.models import Sum, F
from rest_framework.response import Response
import json
# from audits.views import create_movement, asign_credits
# from operators.models import OperationsCategories, Bank, BranchOffice
from .utils import generate_random_id, get_operator_and_validate, divide_batches
# from audits.utils import dollar_to_local, convert_amount_to_dollar

class ProductsViewset(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'name' 
    
    def get_serializer_context(self):
        # Llama al método de la clase base para obtener el contexto por defecto
        context = super().get_serializer_context()
        # Agrega el valor del inventario al contexto
        context['currency'] = self.request.query_params.get("currency")
        print("CONTEXT", context)
        return context
    
    def get_queryset(self):
        inventory = Inventory.objects.last()
        products = inventory.products.all()
        if self.request.query_params.get("name"):
            products = products.filter(name__icontains=self.request.query_params.get("name"))
        # self.inventory_value = products.aggregate(
        #     total_value=Sum(F('price_unit') * F('quantity'))
        # ).get('total_value', 0)
        
        batches = ProductBatch.objects.filter(product__in=products)
        self.inventory_value = batches.aggregate(
            total_value=Sum(F('price_unit') * F('quantity'))
        ).get('total_value', 0)
        self.inventory_value = f"{self.inventory_value:.2f} {'BS'}" if self.inventory_value else f"0.00 {'BS'}"
        return products.exclude(active=False).order_by('-date')
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        print("LISTANDO")
        # Create a custom response including both products and inventory value
        response_data = {
            'products': serializer.data,
            'inventory_value': self.inventory_value
        }
        
        return Response(response_data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
            inventory = Inventory.objects.last()
            product_movement_type = request.data.get("movement_type")
            product_id = request.data.get("product_id")
        
            total_cost = 0
            data = request.data.copy()  # Use copy to avoid modifying the original request data
        
            print("DATA", data, "total_cost", total_cost, "quantity")
        
            if request.data.get("sku"):
                if Product.objects.filter(sku=request.data.get("sku")).exists() and not product_id:
                    raise ValidationError({"sku": "Ya existe un producto con este SKU"})
            if not product_id:
                serializer = self.get_serializer(data=data)
                serializer.is_valid(raise_exception=True)
                # Save the product instance
                product = serializer.save()
            else:
                product = get_object_or_404(Product, id=product_id)
                serializer = self.get_serializer(product, data=data, partial=True)
                serializer.is_valid(raise_exception=True)
                if not product.active:
                     product.active = True
                
                product = serializer.save()

            sell_price = request.data.get("sell_price")
            sell_price = sell_price
            print("IS ENTERING HERE 3")
            ProductBatch.objects.create(product=product,
            sell_price=sell_price,
            location=request.data.get("location"),
            batch=generate_random_id(),
            waste=request.data.get("waste"),
            safety_stock=request.data.get("safety_stock") or 0,
            unit_of_measure=request.data.get("unit_of_measure") or product.unit_of_measure,
            description=request.data.get("description"),
            )

            
            
            
            Movement.objects.create(
                product=product,
                movement_type=product_movement_type,
                date=datetime.now()
            )
            
            inventory.products.add(product)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
       
      
    @action(detail=False, methods=['delete'], url_path='delete-product', url_name='delete-product')
    def delete_product(self, request, *args, **kwargs):
        operatorId = request.query_params.get("office")
        inventory = Inventory.objects.last()
        branch_office = request.query_params.get("branch_office")
        product_id = request.query_params.get("product")
        product = get_object_or_404(Product, id=product_id)
        
        
        batches = ProductBatch.objects.filter(product=product)
        for batch in batches:
            batch.delete()
        
        
        
        product.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
       
    @action(detail=True, methods=['post'])
    def withdraw_product(self, request, *args, **kwargs):
        operatorId = request.data.get("office")
        inventory = Inventory.objects.last()
        
        # operator,inventory, error = get_operator_and_validate(operatorId, request.user)
        product_id = request.data.get("product").get("id")
        quantity = float(request.data.get("quantity"))
        movement_type = request.data.get("movement_type")
        location = request.data.get("location")
  
        product = get_object_or_404(Product, id=product_id)
        batches = ProductBatch.objects.filter(product=product)

        if location:
            batches = batches.filter(location=location)

        batches_quantity = batches.aggregate(total_quantity=Sum('quantity')).get('total_quantity', 0)
        batches_quantity = batches_quantity if batches_quantity else 0
        
        if batches_quantity < quantity:
            raise ValidationError({"quantity": "No hay suficiente cantidad de este producto en ese almacen"})
        # if batch.quantity < quantity:
        #     raise ValidationError({"quantity": "No hay suficiente cantidad de este producto"})
        
        quantity_withdrawn = 0
        for batch in batches:
            if quantity_withdrawn < quantity:
                if batch.quantity >= quantity - quantity_withdrawn:
                    batch.quantity -= quantity - quantity_withdrawn
                    quantity_withdrawn = quantity
                else:
                    quantity_withdrawn += batch.quantity
                    batch.quantity = 0
                batch.save()
            
        # print("BATCH",batches)
        
        # return Response({"error": "No se puede retirar la cantidad solicitada"}, status=status.HTTP_400_BAD_REQUEST)
        # movement_record = Movement(operator=operator, quantity=quantity, movement_type=movement_type, date=datetime.now())
            
        # if request.data.get("bank"):
        #     detail = OperationsCategories.objects.get_or_create(name="Venta")[0]
        #     bank = get_object_or_404(Bank, id=request.data.get("bank"))
        #     motive = request.data.get("motive")
        #     print(product.sell_price, quantity)
        #     data = {
        #         "operation_type": "+",
        #         "amount": str(product.sell_price * quantity),
        #         "sub_detail": motive if motive and motive != "" else "Venta del producto: " + product.name,
        #         "detail": detail
        #     }
        #     date = datetime.now().strftime("%Y-%m-%d")
        #     detail.operators.add(operator)
        #     asign_credits(None, bank, data)
        #     movement = create_movement(data, date, False, operator, detail,bank=bank, request=request)
        #     movement_record.with_sale = movement
        product.save()
        batch.save()
        
        # if variant and variant != "":
        #     movement_record.product_variant = product
        #     movement_record.product = product.product
        #     product = product.product
        # else:
        #     movement_record.product = product
        # # movement_record.save()    
        
        
        return Response(self.get_serializer(product).data, status=status.HTTP_200_OK)
      
    def update_batch(self, request, batch, data):
        ProductBatch.objects.filter(id=batch.id).update(
            quantity=data.get("quantity", batch.quantity),
            price_unit=data.get("price_unit", batch.price_unit),
            sell_price=data.get("sell_price", batch.sell_price),
            location=data.get("location", batch.location),
            waste=data.get("waste", batch.waste),
            safety_stock=data.get("safety_stock", batch.safety_stock),
            unit_of_measure=data.get("unit_of_measure", batch.unit_of_measure),
            description=data.get("description", batch.description)
        )
       
    @action(detail=False, methods=['get'])
    def get_product(self, request, *args, **kwargs):
        product_id = request.query_params.get("product")
        currency = request.query_params.get("currency")
        product = get_object_or_404(Product, id=product_id)
        
        product_serializer = ProductSerializer(product, context={
            'currency': currency
        }).data
        data = {
            "product":product_serializer,
        }
        response = Response(data, status=status.HTTP_200_OK)
        return response
    
    @action(detail=False, methods=['put'])
    def edit_product(self, request, *args, **kwargs):
        operatorId = request.data.get("office")
        product_id = request.data.get("id")
        batch = request.data.get("batch")
        print(request.data)
        print("PRODUCT", product_id)
        product = get_object_or_404(Product, id=product_id)
        
        data = request.data
        serializer = self.get_serializer(product, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        if batch:
            batch = get_object_or_404(ProductBatch, batch=batch)
            self.update_batch(request, batch, data)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['delete'])
    def delete_batch(self, request, *args, **kwargs):
        batch = request.query_params.get("batch")
        inventory = Inventory.objects.last()
        batch = get_object_or_404(ProductBatch, batch=batch)
        print("BATCH", batch)
        product_batch = batch.product
        batches = ProductBatch.objects.filter(product=product_batch)
        if batches.count() == 1:
            return Response({"error": "No se puede eliminar el único lote de un producto"}, status=status.HTTP_400_BAD_REQUEST)
        batch.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['post'])
    def divide_batch(self, request, *args, **kwargs):
        batch = request.data.get("batch")
        quantity = request.data.get("division_quantity")
        location = request.data.get("location")
        operatorId = request.data.get("office")
        inventory = Inventory.objects.last()
               
        if not batch or not quantity:
            raise ValidationError({"batch": "El lote no puede ser nulo o de cantidad nula"})
        new_batch = divide_batches(batch, quantity, location)
        return Response(ProductBatchSerializer(new_batch).data, status=status.HTTP_200_OK)
        
    @action(detail=False, methods=['get'])
    def get_locations(self, request, *args, **kwargs):
        operator_id = request.query_params.get("office")
        inventory = Inventory.objects.last()        
        # products = inventory.products.all()
        # locations = products.values_list('location', flat=True).distinct()
        locations = ProductBatch.objects.filter(product__in=inventory.products.all()).values_list('location', flat=True).distinct()
        is_any_null = any([location == None for location in locations])
        if is_any_null:
            #Reemplazar el nulo por "Sin ubicación"
            locations = ["Sin ubicación" if location == None else location for location in locations]
        
        return Response(locations, status=status.HTTP_200_OK)
                
    @action(detail=False, methods=['get'])
    def get_products_by_location(self, request, *args, **kwargs):
        operatorId = request.query_params.get("office")
        inventory = Inventory.objects.last()
        location = request.query_params.get("location")
        if location == "Sin ubicación":
            location = None
        
        batches = ProductBatch.objects.filter(
            product__in=inventory.products.all(),
            location=location
        ).values(
            'product__name', 'location', 'unit_of_measure', 'quantity', 'id'
        ).annotate(
            total_quantity=Sum('quantity')
        )

    # Return the grouped and annotated batches
        return Response(list(batches), status=status.HTTP_200_OK)
    
    
    @action(detail=False, methods=['post'])
    def transfer_products(self, request, *args, **kwargs ):
        data = request.data
        products = data.get("products")
        destiny_location = data.get("destiny_location")
        origin_location = data.get("origin_location")
        if origin_location == "Sin ubicación":
            origin_location = None
        if destiny_location == origin_location:
            return Response({"error": "La ubicación de origen y destino no pueden ser iguales"}, status=status.HTTP_400_BAD_REQUEST)
        new_batches= []
        for product in products:
            batch = get_object_or_404(ProductBatch, id=product.get("id"))
            if batch.location != origin_location:
                return Response({"error": "El lote no se encuentra en la ubicación de origen"}, status=status.HTTP_400_BAD_REQUEST)
            new_batch = divide_batches(batch.batch, product.get("quantity"), destiny_location)
            new_batches.append(new_batch)
        return Response(ProductBatchSerializer(new_batches, many=True).data, status=status.HTTP_200_OK)        
        
        
        
        
        
        
    # def perform_create(self, serializer):
    #     operatorId = self.request.data.get("office")
    #     product_movement_type = self.request.data.get("movement_type")
    #     operator = get_object_or_404(Operator, id=operatorId)
    #     variants = self.request.data.get("variations")
        
    #     if self.request.data.get("sku"):
    #         if Product.objects.filter(sku=self.request.data.get("sku")).exists():
    #             raise ValidationError({"sku": "Ya existe un producto con este SKU"})
    #     if self.request.user != operator.management_user and not self.request.user == operator.user:
    #         raise PermissionDenied()
    #     inventory = Inventory.objects.get_or_create(user=operator.management_user)
    #     inventory = inventory[0]
    #     data = self.request.data
    #     del data["variations"]
    #     serializer.is_valid(raise_exception=True)
    #     product = serializer.save()
    #     try:
    #         if(variants):
    #             variations = json.loads(variants)
    #             print("VARIACIONES",variations)
    #             for variation in variations:
    #                 ProductVariants.objects.create(product=product, name=variation.get("variation_name"), price=variation.get("variation_price_unit"), quantity=variation.get("variation_quantity"), sku=variation.get("variation_sku"))
    #     except Exception as e:
    #         print("GRAN ERROR",e)
    #         serializer.instance.delete()
    #         return Response({"error": "Error al crear las variaciones"}, status=status.HTTP_400_BAD_REQUEST)
    #     print("SALIENDO")
    #     Movement.objects.create(product=product, quantity=serializer.instance.quantity, movement_type=product_movement_type, date=datetime.now())
    #     inventory.products.add(serializer.instance)
        
    #     return product


class MovementsViewset(viewsets.ModelViewSet):
    queryset = Movement.objects.all()
    serializer_class = MovementSerializer

    def get_queryset(self):
        operatorId = self.request.query_params.get("office")
        type = self.request.query_params.get("type")
        inventory = Inventory.objects.last()
        # Obtener los productos del inventario
        movements = Movement.objects.filter(product__in=inventory.products.all())
        if type != "general":
            movements = movements.filter(movement_type=type)
        
        return movements.order_by('-date')

# Create your views here.