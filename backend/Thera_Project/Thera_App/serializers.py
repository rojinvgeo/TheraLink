from rest_framework import serializers
from .models import Inquiry, Vacancy

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
