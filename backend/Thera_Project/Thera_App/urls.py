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
    AdminPartnerListView,
    PaymentVerifyView,
    PaymentRetryView,
    RazorpayWebhookView,
    PartnerCheckAuthView,
    PartnerDashboardOverviewView,
    PartnerCandidateListView,
    PartnerCandidateDetailView,
    PartnerCandidateRequestView,
    PartnerProfileUpdateView
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
    path('partner/payment/verify/', PaymentVerifyView.as_view(), name='partner-payment-verify'),
    path('partner/payment/retry/', PaymentRetryView.as_view(), name='partner-payment-retry'),
    path('partner/payment/webhook/', RazorpayWebhookView.as_view(), name='partner-payment-webhook'),
    path('partner/check-auth/', PartnerCheckAuthView.as_view(), name='partner-check-auth'),
    path('partner/dashboard/', PartnerDashboardOverviewView.as_view(), name='partner-dashboard-overview'),
    path('partner/candidates/', PartnerCandidateListView.as_view(), name='partner-candidates-list'),
    path('partner/candidates/<int:pk>/', PartnerCandidateDetailView.as_view(), name='partner-candidate-detail'),
    path('partner/requests/', PartnerCandidateRequestView.as_view(), name='partner-candidate-requests'),
    path('partner/profile/', PartnerProfileUpdateView.as_view(), name='partner-profile-update'),
    path('admin/partners/', AdminPartnerListView.as_view(), name='admin-partners-list'),
    path('', include(router.urls)),
]


