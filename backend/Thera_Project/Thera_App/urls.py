from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from .views import (
    InquiryCreateView,
    VacancyListView,
    AdminInquiryViewSet,
    AdminVacancyViewSet,
    health_check_view,
    PartnerRegisterView,
    AdminPartnerListView
)

router = DefaultRouter()
router.register('admin/inquiries', AdminInquiryViewSet, basename='admin-inquiry')
router.register('admin/vacancies', AdminVacancyViewSet, basename='admin-vacancy')

urlpatterns = [
    path('inquiries/', InquiryCreateView.as_view(), name='inquiry-create'),
    path('vacancies/', VacancyListView.as_view(), name='vacancy-list'),
    path('auth/login/', obtain_auth_token, name='auth-login'),
    path('health/', health_check_view, name='health-check'),
    path('partner/register/', PartnerRegisterView.as_view(), name='partner-register'),
    path('admin/partners/', AdminPartnerListView.as_view(), name='admin-partners-list'),
    path('', include(router.urls)),
]
