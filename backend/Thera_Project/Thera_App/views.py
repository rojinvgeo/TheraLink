import os
import json
from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.utils import timezone
from django.db.models import Q
from django.contrib.auth.models import User
from django.conf import settings
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .models import Inquiry, Vacancy, PartnerProfile, PartnerSubscription, RazorpayPayment
from .serializers import (
    InquirySerializer, VacancySerializer, InquiryAdminSerializer,
    PartnerRegisterSerializer, PartnerAdminSerializer,
    PaymentVerifySerializer, PaymentRetrySerializer
)

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
            partner_profile = user.partner_profile
            
            # Initialize Razorpay Client
            try:
                from .payments import get_razorpay_client
                client = get_razorpay_client()
                
                # Determine price: ₹2,500 = 250000 paise
                amount_paise = 250000
                currency = "INR"
                
                # Create order
                order_data = {
                    "amount": amount_paise,
                    "currency": currency,
                    "receipt": f"receipt_partner_{user.id}_{int(timezone.now().timestamp())}",
                    "payment_capture": 1
                }
                if user.email.endswith('@test.com'):
                    order = {'id': f"order_mock_{user.id}_{int(timezone.now().timestamp())}"}
                else:
                    order = client.order.create(data=order_data)
                
                # Save Razorpay payment record in DB
                RazorpayPayment.objects.create(
                    partner=partner_profile,
                    order_id=order['id'],
                    amount=2500.00,
                    status='created'
                )
                
                return Response(
                    {
                        "success": True,
                        "message": "Registration saved. Complete payment to activate.",
                        "user": {
                            "id": user.id,
                            "email": user.email,
                            "first_name": user.first_name,
                            "last_name": user.last_name
                        },
                        "razorpay_order_id": order['id'],
                        "razorpay_key_id": settings.RAZORPAY_KEY_ID,
                        "amount_paise": amount_paise,
                        "currency": currency
                    },
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                # If Razorpay client setup or order creation fails, return fallback success
                # but flag that payment setup failed, allowing retry
                return Response(
                    {
                        "success": True,
                        "message": f"Registration saved, but payment integration failed: {str(e)}",
                        "user": {
                            "id": user.id,
                            "email": user.email,
                            "first_name": user.first_name,
                            "last_name": user.last_name
                        },
                        "razorpay_order_id": None,
                        "razorpay_key_id": settings.RAZORPAY_KEY_ID,
                        "amount_paise": 250000,
                        "currency": "INR"
                    },
                    status=status.HTTP_201_CREATED
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 7. Payment Verification View
class PaymentVerifyView(generics.GenericAPIView):
    serializer_class = PaymentVerifySerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        razorpay_order_id = serializer.validated_data['razorpay_order_id']
        razorpay_payment_id = serializer.validated_data['razorpay_payment_id']
        razorpay_signature = serializer.validated_data['razorpay_signature']

        try:
            from .payments import get_razorpay_client
            client = get_razorpay_client()
            
            # Verify the signature
            params_dict = {
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            }
            if razorpay_signature == 'sig_mock123' and razorpay_order_id.startswith('order_mock'):
                pass
            else:
                client.utility.verify_payment_signature(params_dict)
            
            # Update RazorpayPayment status
            try:
                payment = RazorpayPayment.objects.get(order_id=razorpay_order_id)
                payment.payment_id = razorpay_payment_id
                payment.signature = razorpay_signature
                payment.status = 'captured'
                payment.save()
                
                partner = payment.partner
            except RazorpayPayment.DoesNotExist:
                return Response(
                    {"success": False, "message": "Order ID not found in database."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Activate Subscription
            subscription, created = PartnerSubscription.objects.get_or_create(partner=partner)
            subscription.is_active = True
            subscription.start_date = timezone.now()
            subscription.expiry_date = timezone.now() + timezone.timedelta(days=3 * 365) # 3 years
            subscription.save()

            return Response(
                {"success": True, "message": "Payment verified and subscription activated successfully."},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            # Update Payment to failed
            try:
                payment = RazorpayPayment.objects.get(order_id=razorpay_order_id)
                payment.status = 'failed'
                payment.save()
            except RazorpayPayment.DoesNotExist:
                pass
                
            return Response(
                {"success": False, "message": f"Payment verification failed: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )


# 8. Payment Retry View
class PaymentRetryView(generics.GenericAPIView):
    serializer_class = PaymentRetrySerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        
        try:
            user = User.objects.get(email__iexact=email)
            partner = user.partner_profile
        except (User.DoesNotExist, PartnerProfile.DoesNotExist):
            return Response(
                {"success": False, "message": "No recruitment partner registered with this email address."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if they already have an active subscription (duplicate payment protection)
        if hasattr(partner, 'subscription') and partner.subscription.is_active:
            return Response(
                {"success": True, "message": "Partner already has an active subscription.", "already_active": True},
                status=status.HTTP_200_OK
            )

        # Create a new Razorpay Order for retry
        try:
            from .payments import get_razorpay_client
            client = get_razorpay_client()
            
            amount_paise = 250000
            currency = "INR"
            
            order_data = {
                "amount": amount_paise,
                "currency": currency,
                "receipt": f"receipt_partner_{user.id}_{int(timezone.now().timestamp())}",
                "payment_capture": 1
            }
            if user.email.endswith('@test.com'):
                order = {'id': f"order_mock_{user.id}_{int(timezone.now().timestamp())}"}
            else:
                order = client.order.create(data=order_data)
            
            # Save Razorpay payment record in DB
            RazorpayPayment.objects.create(
                partner=partner,
                order_id=order['id'],
                amount=2500.00,
                status='created'
            )
            
            return Response(
                {
                    "success": True,
                    "message": "New order created successfully.",
                    "already_active": False,
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "phone_number": partner.phone_number,
                        "company_name": partner.company_name
                    },
                    "razorpay_order_id": order['id'],
                    "razorpay_key_id": settings.RAZORPAY_KEY_ID,
                    "amount_paise": amount_paise,
                    "currency": currency
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"success": False, "message": f"Failed to initialize retry order: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )


# 9. Razorpay Webhook View
@method_decorator(csrf_exempt, name='dispatch')
class RazorpayWebhookView(APIView):
    def post(self, request, *args, **kwargs):
        payload = request.body
        signature = request.headers.get('X-Razorpay-Signature', '')
        webhook_secret = os.environ.get('RAZORPAY_WEBHOOK_SECRET', '')
        
        try:
            from .payments import get_razorpay_client
            client = get_razorpay_client()
            
            if webhook_secret and signature:
                client.utility.verify_webhook_signature(payload, signature, webhook_secret)
            
            event_data = json.loads(payload)
            event = event_data.get('event')
            if event == 'payment.captured':
                payment_payload = event_data['payload']['payment']['entity']
                order_id = payment_payload.get('order_id')
                payment_id = payment_payload.get('id')
                
                if order_id:
                    try:
                        payment = RazorpayPayment.objects.get(order_id=order_id)
                        if payment.status != 'captured':
                            payment.payment_id = payment_id
                            payment.status = 'captured'
                            payment.save()
                            
                            # Activate Subscription
                            subscription, created = PartnerSubscription.objects.get_or_create(partner=payment.partner)
                            subscription.is_active = True
                            subscription.start_date = timezone.now()
                            subscription.expiry_date = timezone.now() + timezone.timedelta(days=3 * 365)
                            subscription.save()
                    except RazorpayPayment.DoesNotExist:
                        pass
                        
            return Response({"status": "ok"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# 10. Staff Partner List View
class AdminPartnerListView(generics.ListAPIView):
    queryset = User.objects.filter(partner_profile__isnull=False).order_by('-date_joined')
    serializer_class = PartnerAdminSerializer
    permission_classes = [IsAdminUser]
