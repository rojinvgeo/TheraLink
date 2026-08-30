from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import Inquiry, Vacancy, PartnerProfile

class PartnerProfileInline(admin.StackedInline):
    model = PartnerProfile
    can_delete = False
    verbose_name_plural = 'Recruitment Partner Details'
    fk_name = 'user'

# Unregister default User admin
admin.site.unregister(User)

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    inlines = (PartnerProfileInline,)
    list_display = BaseUserAdmin.list_display + ('get_company_name', 'get_phone_number', 'get_payment_status', 'get_razorpay_order_id', 'get_subscription_status')
    search_fields = BaseUserAdmin.search_fields + ('partner_profile__company_name', 'partner_profile__phone_number')
    list_filter = BaseUserAdmin.list_filter + ('date_joined',)

    def get_company_name(self, obj):
        try:
            return obj.partner_profile.company_name
        except PartnerProfile.DoesNotExist:
            return '-'
    get_company_name.short_description = 'Company Name'

    def get_phone_number(self, obj):
        try:
            return obj.partner_profile.phone_number
        except PartnerProfile.DoesNotExist:
            return '-'
    get_phone_number.short_description = 'Phone Number'

    def get_payment_status(self, obj):
        try:
            payment = obj.partner_profile.payments.order_by('-created_at').first()
            return payment.status if payment else 'No Payment'
        except (AttributeError, PartnerProfile.DoesNotExist):
            return '-'
    get_payment_status.short_description = 'Payment Status'

    def get_razorpay_order_id(self, obj):
        try:
            payment = obj.partner_profile.payments.order_by('-created_at').first()
            return payment.order_id if payment else '-'
        except (AttributeError, PartnerProfile.DoesNotExist):
            return '-'
    get_razorpay_order_id.short_description = 'Razorpay Order ID'

    def get_subscription_status(self, obj):
        try:
            sub = obj.partner_profile.subscription
            if sub.is_active:
                return f"Active (Exp: {sub.expiry_date.strftime('%Y-%m-%d')})"
            return "Inactive"
        except (AttributeError, PartnerProfile.DoesNotExist):
            return '-'
    get_subscription_status.short_description = 'Subscription Status'


@admin.register(Vacancy)
class VacancyAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'status', 'location', 'employment_type', 'posted_at', 'display_order')
    list_filter = ('status', 'employment_type', 'posted_at')
    search_fields = ('title', 'slug', 'location', 'summary', 'description')
    prepopulated_fields = {'slug': ('title',)}

@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'inquiry_type', 'status', 'created_at', 'vacancy')
    list_filter = ('inquiry_type', 'status', 'created_at')
    search_fields = ('name', 'email', 'phone', 'organization_name', 'message')
    raw_id_fields = ('vacancy',)

