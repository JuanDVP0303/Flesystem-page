from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Account
from .serializers import AccountSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.exceptions import ValidationError
from inventory.models import Inventory
from .constants import PERMISSIONS

class CreateUserView(APIView):
    def post(self, request, **kwargs):
        data = request.data.copy()
        if kwargs.get('management_user_data'):
            data = kwargs.get('management_user_data')
        print("DATA", data)
        if data.get("pf", None) == "pf":
            data["is_pf"] = True
        serializer = AccountSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            user.set_password(data.get('password'))
            user.is_active = True
            user.save()
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            user_serializer = AccountSerializer(user)    
            return Response({"access_token": access_token, "refresh":refresh_token, "account":user_serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginUserView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = Account.objects.filter(email=email)
        if not user.exists():
            return Response({"error":"Usuario no encontrado"}, status=status.HTTP_400_BAD_REQUEST)
        user = user.first()
        user_serializer = AccountSerializer(user)
        if not user.is_active:
            return Response({"error":"Usuario inactivo"}, status=status.HTTP_400_BAD_REQUEST)
        if user.check_password(password):
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            return Response({"access_token": access_token, "refresh":refresh_token, "account":user_serializer.data}, status=status.HTTP_200_OK)
        return Response({"error":"Credenciales Invalidas"}, status=status.HTTP_400_BAD_REQUEST)

class LogoutUserView(APIView):
    def post(self, request):
        refresh_token = request.data.get('refresh')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message":"Sesion cerrada"}, status=status.HTTP_200_OK)


class UsersViewset(APIView):
    def get(self, request):
        if request.GET.get('auth'):
            print("AUTH", request.GET.get('auth'), request.user)
            user = Account.objects.get(id=request.user.id)
            serializer = AccountSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        if request.user.is_superuser:
            users = Account.objects.all().exclude(is_subsidiary=True).exclude(id=request.user.id)
            users_pf = Account.objects.filter(is_pf=True).exclude(id=request.user.id)
            users = users.union(users_pf)
            serializer = AccountSerializer(users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error":"No tienes permisos para realizar esta accion"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        if request.user.is_superuser:
            user_id = self.request.query_params.get('user_id')
            user = Account.objects.get(id=user_id)
            if user.is_superuser:
                raise ValidationError({"error":"No puedes eliminar un superusuario"})
            user.delete()
            return Response({"message":"Usuario eliminado"}, status=status.HTTP_204_NO_CONTENT)
class TokenRefreshCustomView(TokenRefreshView):
    pass

# class CountryList(APIView):
#     def get(self, request, format=None):
#         countries = [
#             {
#                 "code": country[0],
#                 "name": country[1]
#             } for country in COUNTRIES
#         ]
#         return Response(countries, status=status.HTTP_200_OK)