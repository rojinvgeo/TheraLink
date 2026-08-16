from django.contrib import admin
from .models import Inquiry, Vacancy

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
