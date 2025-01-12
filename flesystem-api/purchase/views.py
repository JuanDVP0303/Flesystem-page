from rest_framework import viewsets
from .models import Provider, Order
from .serializers import ProviderSerializer, OrderSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from inventory.models import Product, ProductBatch
from inventory.utils import generate_random_id

class PurchaseViewset(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class =OrderSerializer
    lookup_field = 'id' 

    def get_queryset(self):
        return Provider.objects.all()
    
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)
    

    
    @action(detail=False, methods=['post'], url_path='create-order')
    def create_order(self, request):
        """
        Crea una orden de compra, vincula los productos con sus cantidades
        y costos unitarios, y actualiza el stock en el inventario.
        """
        provider_id = request.data.get("provider")
        purchase_date = request.data.get("purchase_date")
        product_id = request.data.get("product")
        if not provider_id or not purchase_date or not product_id:
            return Response(
                {"error": "Proveedor, fecha de compra y productos son requeridos."},
                status=400,
            )

        # Validar si el proveedor existe
        try:
            provider = Provider.objects.get(id=provider_id)
        except Provider.DoesNotExist:
            return Response({"error": "El proveedor no existe."}, status=404)

        # Crear la orden de compra

        # Procesar los productos
        quantity = request.data.get("quantity")
        price_unit = request.data.get("price_unit")
        print("TOTAL",float(request.data.get("total_cost",0)))
        if not product_id or not quantity or not price_unit:
            return Response(
                {"error": "Cada producto debe incluir ID, cantidad y precio unitario."},
                status=400,
            )

        # Validar si el producto existe
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": f"Producto con ID {product_id} no encontrado."}, status=404)
        order = Order.objects.create(
            invoice_number=request.data.get("invoice_number"),
            provider=provider,
            purchase_date=purchase_date,
            status = "PENDING",
            total_cost = float(request.data.get("total_cost",0)),
            product=product,
            quantity=quantity,
            
        )
        # Crear el lote del producto
        batch = ProductBatch.objects.create(
            product=product,
            purchase_order=order,
            quantity=quantity,
            price_unit=price_unit,
            sell_price=product.sell_price,
            batch=generate_random_id(),
            description=product.description,
            unit_of_measure=product.unit_of_measure,            
            
            
        )

        return Response(
            {"message": "Orden de compra creada exitosamente.", "data" : OrderSerializer(order).data},
            status=201,
        )
        
    @action(detail=False, methods=['get'], url_path='get-orders')
    def get_orders(self, request):
        orders = Order.objects.all().order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    

        
class ProviderViewset(viewsets.ModelViewSet):
    queryset = Provider.objects.all()
    serializer_class = ProviderSerializer
    lookup_field = 'id' 

    def get_queryset(self):
        return Provider.objects.all()
    
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)
    

    @action(detail=False, methods=['get'], url_path='get-providers')
    def get_providers(self, request):
        query = request.query_params.get('name', None)
        providers = Provider.objects.filter(name__icontains=query)
        serializer = ProviderSerializer(providers, many=True)
        return Response(serializer.data)
    