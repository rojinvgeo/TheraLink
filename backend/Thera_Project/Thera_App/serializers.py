from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Inquiry, Vacancy, PartnerProfile, PartnerSubscription, RazorpayPayment, Candidate, CandidateRequest

class VacancySerializer(serializers.ModelSerializer):
    class Meta:
        model = Vacancy
        fields = '__all__'


class InquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = [
            'id', 'inquiry_type', 'status', 'name', 'email', 'phone',
            'organization_name', 'role_or_profession', 'location',
            'preferred_contact_method', 'therapist_type_needed', 'message',
            'consent', 'vacancy', 'vacancy_context', 'created_at'
        ]
        read_only_fields = ['id', 'status', 'vacancy', 'created_at']

    def validate(self, attrs):
        email = attrs.get('email')
        phone = attrs.get('phone')
        if not email and not phone:
            raise serializers.ValidationError(
                {"contact": "At least one contact method (Email or Phone) is required."}
            )
        return attrs

    def create(self, validated_data):
        # Automatically try to link to Vacancy if vacancy_context is provided
        vacancy_context = validated_data.get('vacancy_context')
        if vacancy_context:
            try:
                # Try finding active vacancy by slug first
                vacancy = Vacancy.objects.filter(slug=vacancy_context, status='active').first()
                if not vacancy:
                    # Fallback to UUID lookup if slug is a UUID string
                    import uuid
                    try:
                        uuid.UUID(vacancy_context)
                        vacancy = Vacancy.objects.filter(id=vacancy_context, status='active').first()
                    except ValueError:
                        pass
                if vacancy:
                    validated_data['vacancy'] = vacancy
            except Exception:
                pass
        return super().create(validated_data)


class InquiryAdminSerializer(serializers.ModelSerializer):
    vacancy_detail = VacancySerializer(source='vacancy', read_only=True)

    class Meta:
        model = Inquiry
        fields = '__all__'


class PartnerRegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    phone_number = serializers.CharField(max_length=50)
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True)
    company_name = serializers.CharField(max_length=255)
    website = serializers.CharField(max_length=255, required=False, allow_blank=True, allow_null=True)
    country = serializers.CharField(max_length=100, default='India')

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email address already exists.")
        return value

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        name = validated_data['name']
        email = validated_data['email']
        password = validated_data['password']
        phone_number = validated_data['phone_number']
        company_name = validated_data['company_name']
        website = validated_data.get('website', '') or ''
        country = validated_data.get('country', 'India')

        # Split name into first and last name
        name_parts = name.strip().split(' ', 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ''

        # Create standard Django user using email as username
        username = email.lower()
        user = User.objects.create_user(
            username=username,
            email=email.lower(),
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        # Create associated partner profile details
        PartnerProfile.objects.create(
            user=user,
            phone_number=phone_number,
            company_name=company_name,
            website=website,
            country=country
        )

        return user


class PartnerAdminSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    phone_number = serializers.CharField(source='partner_profile.phone_number')
    company_name = serializers.CharField(source='partner_profile.company_name')
    website = serializers.CharField(source='partner_profile.website', allow_null=True, required=False)
    country = serializers.CharField(source='partner_profile.country')

    class Meta:
        model = User
        fields = [
            'id', 'name', 'email', 'date_joined',
            'phone_number', 'company_name', 'website', 'country'
        ]

    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username


class PaymentVerifySerializer(serializers.Serializer):
    razorpay_order_id = serializers.CharField(max_length=255)
    razorpay_payment_id = serializers.CharField(max_length=255)
    razorpay_signature = serializers.CharField(max_length=255)


class PaymentRetrySerializer(serializers.Serializer):
    email = serializers.EmailField()


class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = '__all__'


class CandidateRequestSerializer(serializers.ModelSerializer):
    candidate_details = CandidateSerializer(source='candidate', read_only=True)
    
    class Meta:
        model = CandidateRequest
        fields = ['id', 'candidate', 'candidate_details', 'status', 'request_notes', 'created_at', 'updated_at']


class PartnerProfileUpdateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', max_length=150)
    last_name = serializers.CharField(source='user.last_name', max_length=150)
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = PartnerProfile
        fields = ['first_name', 'last_name', 'email', 'phone_number', 'company_name', 'website', 'country']
        
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        if user_data:
            user = instance.user
            user.first_name = user_data.get('first_name', user.first_name)
            user.last_name = user_data.get('last_name', user.last_name)
            user.save()
            
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.company_name = validated_data.get('company_name', instance.company_name)
        instance.website = validated_data.get('website', instance.website)
        instance.country = validated_data.get('country', instance.country)
        instance.save()
        return instance


