from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.http import JsonResponse
from django.views.decorators.cache import cache_page
import os
from django.conf import settings

def api_info(request):
    return JsonResponse({
        'message': 'Support Ticket System API',
        'endpoints': {
            'api': '/api/tickets/',
            'admin': '/admin/',
        }
    })

class IndexView(TemplateView):
    template_name = 'index.html'
    
    def get_template_names(self):
        frontend_path = os.path.join(settings.STATIC_ROOT, 'frontend', 'index.html')
        if os.path.exists(frontend_path):
            # Return the absolute path to the frontend index.html
            return [frontend_path]
        return ['index.html']

urlpatterns = [
    path('api/info/', api_info),
    path('admin/', admin.site.urls),
    path('api/tickets/', include('tickets.urls')),
    # Catch-all for React SPA - must be last
    path('', IndexView.as_view(), name='index'),
]
