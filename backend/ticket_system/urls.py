from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.views.static import serve
from django.conf import settings
import os

def root_view(request):
    # Serve React app's index.html for frontend SPA
    frontend_path = os.path.join(settings.STATIC_ROOT, 'frontend', 'index.html')
    if os.path.exists(frontend_path):
        with open(frontend_path, 'r') as f:
            return JsonResponse({
                'redirect': '/',
                'message': 'Frontend is available'
            })
    
    # Fallback API info
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

# Serve frontend static files (React build)
if settings.DEBUG is False:
    urlpatterns += [
        path('', serve, {'document_root': os.path.join(settings.STATIC_ROOT, 'frontend'), 'path': 'index.html'}),
    ]
