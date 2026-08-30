import uuid
from django.db import models
from django.core.exceptions import ValidationError

class Vacancy(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('closed', 'Closed'),
        ('archived', 'Archived'),
    ]

    EMPLOYMENT_TYPES = [
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('contract', 'Contract'),
        ('temporary', 'Temporary'),
        ('other', 'Other'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    location = models.CharField(max_length=255, blank=True, null=True)
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPES, blank=True, null=True)
    summary = models.TextField()
    description = models.TextField(blank=True, null=True)
    requirements = models.TextField(blank=True, null=True)
    posted_at = models.DateTimeField(blank=True, null=True)
    closes_at = models.DateTimeField(blank=True, null=True)
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', '-posted_at', '-created_at']

    def __str__(self):
        return f"{self.title} ({self.get_status_display()})"


class Inquiry(models.Model):
    INQUIRY_TYPES = [
        ('organization', 'Healthcare Organization / Clinic / Provider'),
        ('family', 'Family / Caregiver / Individual Client'),
        ('therapist', 'Qualified Therapist (Joining Talent Pool)'),
        ('other', 'Other General Inquiry'),
    ]

    STATUS_CHOICES = [
        ('new', 'New'),
        ('qualified', 'Qualified'),
        ('unqualified', 'Unqualified'),
        ('contacted', 'Contacted'),
        ('closed', 'Closed'),
    ]

    CONTACT_METHODS = [
        ('email', 'Email'),
        ('phone', 'Phone'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    inquiry_type = models.CharField(max_length=20, choices=INQUIRY_TYPES, default='other')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    
    organization_name = models.CharField(max_length=255, blank=True, null=True)
    role_or_profession = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    
    preferred_contact_method = models.CharField(max_length=10, choices=CONTACT_METHODS, default='email')
    therapist_type_needed = models.CharField(max_length=255, blank=True, null=True)
    message = models.TextField()
    
    consent = models.BooleanField(default=False)
    internal_notes = models.TextField(blank=True, null=True)
    
    # Vacancy context (both foreign key relationship and text fallback context)
    vacancy = models.ForeignKey(Vacancy, on_delete=models.SET_NULL, blank=True, null=True, related_name='inquiries')
    vacancy_context = models.CharField(max_length=255, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Inquiries"
        ordering = ['-created_at']

    def clean(self):
        super().clean()
        if not self.email and not self.phone:
            raise ValidationError("At least one contact method (Email or Phone) is required.")

    def __str__(self):
        return f"{self.name} - {self.get_inquiry_type_display()} ({self.status})"


class PartnerProfile(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE, related_name='partner_profile')
    phone_number = models.CharField(max_length=50)
    company_name = models.CharField(max_length=255)
    website = models.CharField(max_length=255, blank=True, null=True)
    country = models.CharField(max_length=100, default='India')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Recruitment Partner Details"
        verbose_name_plural = "Recruitment Partner Details"

    def __str__(self):
        return f"{self.company_name} ({self.user.email})"


class PartnerSubscription(models.Model):
    partner = models.OneToOneField(PartnerProfile, on_delete=models.CASCADE, related_name='subscription')
    plan_name = models.CharField(max_length=100, default='3-Year Partner Plan')
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=2500.00)
    is_active = models.BooleanField(default=False)
    start_date = models.DateTimeField(blank=True, null=True)
    expiry_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Recruitment Partner Subscription"
        verbose_name_plural = "Recruitment Partner Subscriptions"

    def __str__(self):
        return f"{self.partner.company_name} - {self.plan_name} (Active: {self.is_active})"


class RazorpayPayment(models.Model):
    STATUS_CHOICES = [
        ('created', 'Created'),
        ('captured', 'Captured'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    partner = models.ForeignKey(PartnerProfile, on_delete=models.CASCADE, related_name='payments')
    order_id = models.CharField(max_length=255, unique=True)
    payment_id = models.CharField(max_length=255, blank=True, null=True)
    signature = models.CharField(max_length=255, blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=2500.00)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Razorpay Payment Log"
        verbose_name_plural = "Razorpay Payment Logs"

    def __str__(self):
        return f"Order: {self.order_id} ({self.status})"


class Candidate(models.Model):
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('placed', 'Placed'),
        ('unavailable', 'Unavailable'),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=30)
    job_role = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    experience_years = models.IntegerField(default=0)
    skills = models.TextField(help_text="Comma-separated list of skills")
    bio = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='available')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Candidate Profile"
        verbose_name_plural = "Candidate Profiles"

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.job_role})"


class CandidateRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    partner = models.ForeignKey(PartnerProfile, on_delete=models.CASCADE, related_name='candidate_requests')
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='requests')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    request_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Partner Candidate Request"
        verbose_name_plural = "Partner Candidate Requests"
        unique_together = ('partner', 'candidate')

    def __str__(self):
        return f"Request by {self.partner.company_name} for {self.candidate.first_name} ({self.status})"



