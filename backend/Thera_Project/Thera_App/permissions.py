from rest_framework.permissions import BasePermission
from .models import PartnerProfile

class IsSubscribedPartner(BasePermission):
    """
    Allows access only to authenticated users who have a PartnerProfile
    and an active subscription.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:
            partner = request.user.partner_profile
            # Check if they have an active subscription
            return hasattr(partner, 'subscription') and partner.subscription.is_active
        except (AttributeError, PartnerProfile.DoesNotExist):
            return False
