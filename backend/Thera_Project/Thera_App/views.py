from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.utils import timezone
from django.db.models import Q
from django.contrib.auth.models import User
from .models import Inquiry, Vacancy
from .serializers import InquirySerializer, VacancySerializer, InquiryAdminSerializer, PartnerRegisterSerializer, PartnerAdminSerializer

# 1. Public Inquiries Create View
class InquiryCreateView(generics.CreateAPIView):
    queryset = Inquiry.objects.all()
    serializer_class = InquirySerializer


# 2. Public Vacancies List View (active only)
class VacancyListView(generics.ListAPIView):
    serializer_class = VacancySerializer

    def get_queryset(self):
        now = timezone.now()
        # Filter for active vacancies where posted_at is past/null and closes_at is future/null
        return Vacancy.objects.filter(status='active').filter(
            Q(posted_at__isnull=True) | Q(posted_at__lte=now)
        ).filter(
            Q(closes_at__isnull=True) | Q(closes_at__gte=now)
        )


# 3. Staff Inquiry ViewSet (triage list & update notes/status)
class AdminInquiryViewSet(viewsets.ModelViewSet):
    queryset = Inquiry.objects.all().order_by('-created_at')
    serializer_class = InquiryAdminSerializer
    permission_classes = [IsAdminUser]
    # Allow reading and updating, disable POST directly on this viewset (creation goes through InquiryCreateView)
    http_method_names = ['get', 'patch', 'delete', 'head', 'options']


# 4. Staff Vacancy ViewSet (manage vacancies)
class AdminVacancyViewSet(viewsets.ModelViewSet):
    queryset = Vacancy.objects.all().order_by('display_order', '-created_at')
    serializer_class = VacancySerializer
    permission_classes = [IsAdminUser]


# 5. Health check view
@api_view(['GET'])
def health_check_view(request):
    return Response({"status": "healthy"}, status=status.HTTP_200_OK)


# 6. Recruitment Partner Registration View
class PartnerRegisterView(generics.CreateAPIView):
    serializer_class = PartnerRegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "success": True,
                    "message": "Registration completed successfully.",
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name
                    }
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 6. Staff Partner List View
class AdminPartnerListView(generics.ListAPIView):
    queryset = User.objects.filter(partner_profile__isnull=False).order_by('-date_joined')
    serializer_class = PartnerAdminSerializer
    permission_classes = [IsAdminUser]
