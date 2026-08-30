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
    list_display = BaseUserAdmin.list_display + ('get_company_name', 'get_phone_number')
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

