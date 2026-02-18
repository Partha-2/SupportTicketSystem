from django.contrib import admin
from django.urls import path, include

from django.http import JsonResponse, FileResponse, Http404
from django.conf import settings
import os

def api_info(request):
    return JsonResponse({
        'message': 'Support Ticket System API',
        'endpoints': {
            'api': '/api/tickets/',
            'admin': '/admin/',
        }
    })

def serve_react(request):
    """Serve the React app's index.html for all non-API, non-admin routes."""
    index_path = os.path.join(settings.STATIC_ROOT, 'frontend', 'index.html')
    if os.path.exists(index_path):
        return FileResponse(open(index_path, 'rb'), content_type='text/html')
    raise Http404()

urlpatterns = [
    path('api/info/', api_info),
    path('admin/', admin.site.urls),
    path('api/tickets/', include('tickets.urls')),
]

# Catch-all for React SPA (must be last)
from django.urls import re_path
urlpatterns += [
    re_path(r'^(?!api/|admin/).*$', serve_react),
]
