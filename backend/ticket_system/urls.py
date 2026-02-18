from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def root_view(request):
    return JsonResponse({
        'message': 'Support Ticket System API',
        'endpoints': {
            'api': '/api/tickets/',
            'admin': '/admin/',
        }
    })

urlpatterns = [
    path('', root_view),
    path('admin/', admin.site.urls),
    path('api/tickets/', include('tickets.urls')),
]
