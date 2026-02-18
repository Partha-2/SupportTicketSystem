import os
import json
from datetime import timedelta
from django.utils import timezone
from django.db.models import Count, Avg, Q
from django.db.models.functions import TruncDay
from rest_framework import viewsets, views, status, filters
from rest_framework.response import Response
from .models import Ticket
from .serializers import TicketSerializer
import requests

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description']

    def get_queryset(self):
        queryset = Ticket.objects.all()
        category = self.request.query_params.get('category')
        priority = self.request.query_params.get('priority')
        status_param = self.request.query_params.get('status')
        
        if category:
            queryset = queryset.filter(category=category)
        if priority:
            queryset = queryset.filter(priority=priority)
        if status_param:
            queryset = queryset.filter(status=status_param)
            
        return queryset

class StatsView(views.APIView):
    def get(self, request):
        total_tickets = Ticket.objects.count()
        open_tickets = Ticket.objects.filter(status='open').count()
        
        # Priority breakdown
        priority_counts = Ticket.objects.values('priority').annotate(count=Count('priority'))
        priority_breakdown = {p['priority']: p['count'] for p in priority_counts}
        # Ensure all choices are present
        for choice, _ in Ticket.PRIORITY_CHOICES:
            priority_breakdown.setdefault(choice, 0)

        # Category breakdown
        category_counts = Ticket.objects.values('category').annotate(count=Count('category'))
        category_breakdown = {c['category']: c['count'] for c in category_counts}
        for choice, _ in Ticket.CATEGORY_CHOICES:
            category_breakdown.setdefault(choice, 0)

        # Avg tickets per day
        # Calculate days since first ticket or just last 30 days
        first_ticket = Ticket.objects.order_by('created_at').first()
        if first_ticket:
            days_diff = (timezone.now() - first_ticket.created_at).days + 1
            avg_per_day = total_tickets / days_diff
        else:
            avg_per_day = 0

        return Response({
            "total_tickets": total_tickets,
            "open_tickets": open_tickets,
            "avg_tickets_per_day": round(avg_per_day, 1),
            "priority_breakdown": priority_breakdown,
            "category_breakdown": category_breakdown
        })

class ClassifyView(views.APIView):
    def post(self, request):
        description = request.data.get('description')
        if not description:
            return Response({"error": "Description is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Prompt for LLM
        prompt = f"""
        Classify the following support ticket description into a category and priority level.
        Categories: billing, technical, account, general
        Priorities: low, medium, high, critical

        Description: {description}

        Return only a JSON object with keys "suggested_category" and "suggested_priority".
        """

        # LLM Logic (Placeholder for Gemini API)
        # Using Google Generative AI as it's often available in these environments.
        # Fallback to general suggestion if API fails.
        
        suggested_category = "general"
        suggested_priority = "medium"

        api_key = os.getenv('GEMINI_API_KEY') or os.getenv('OPENAI_API_KEY')
        
        if api_key:
            try:
                # Example for Gemini API call
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
                payload = {
                    "contents": [{
                        "parts": [{"text": prompt}]
                    }]
                }
                response = requests.post(url, json=payload, timeout=5)
                if response.status_code == 200:
                    data = response.json()
                    llm_text = data['candidates'][0]['content']['parts'][0]['text']
                    # Attempt to parse JSON from LLM text
                    import re
                    match = re.search(r'\{.*\}', llm_text, re.DOTALL)
                    if match:
                        llm_json = json.loads(match.group())
                        suggested_category = llm_json.get('suggested_category', suggested_category)
                        suggested_priority = llm_json.get('suggested_priority', suggested_priority)
            except Exception as e:
                print(f"LLM Classification failed: {e}")

        return Response({
            "suggested_category": suggested_category,
            "suggested_priority": suggested_priority
        })
