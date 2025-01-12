from django.http import HttpResponseForbidden
from rest_framework_simplejwt.authentication import JWTAuthentication
#Importar validation error
from django.http import JsonResponse

from rest_framework.exceptions import ValidationError
class CheckIfUserIsMaster:
    def __init__(self, get_response):
        self.get_response = get_response
        self.jwt_authentication = JWTAuthentication()

    def __call__(self, request):
        if request.path.startswith('/admin/'):
            return self.get_response(request)
        return self.process_request(request)
    
    def process_request(self, request):
        method = request.method
        path = request.path
        print(request.GET.get("habilited_superuser"))
        habilited_user = request.GET.get("habilited_superuser")
        auth_result = self.jwt_authentication.authenticate(request)
        if auth_result is not None and not habilited_user:
            user, _ = auth_result
            if user.is_superuser and method != 'GET' and path not in ["/users/logout/", "/users/users/"]:
                return JsonResponse({"Error master": " El usuario master no puede realizar esta accion"}, status=403)

        return self.get_response(request)