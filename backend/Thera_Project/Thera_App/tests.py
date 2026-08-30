from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import Inquiry, Vacancy, PartnerProfile
from django.utils import timezone

class InquiryAPITests(APITestCase):
    def setUp(self):
        self.create_url = reverse('inquiry-create')
        self.health_url = reverse('health-check')

    def test_create_inquiry_success(self):
        data = {
            'inquiry_type': 'therapist',
            'name': 'Alice Smith',
            'email': 'alice@example.com',
            'phone': '123-456-7890',
            'message': 'Interested in occupational therapy placements.',
            'consent': True,
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Inquiry.objects.count(), 1)
        self.assertEqual(Inquiry.objects.get().name, 'Alice Smith')

    def test_create_inquiry_missing_contact_info(self):
        data = {
            'inquiry_type': 'family',
            'name': 'Bob Jones',
            'message': 'Looking for a physical therapist.',
            'consent': True,
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('contact', response.data)

    def test_create_inquiry_with_only_email_passes(self):
        data = {
            'inquiry_type': 'other',
            'name': 'Carol White',
            'email': 'carol@example.com',
            'message': 'General query.',
            'consent': True,
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_inquiry_with_only_phone_passes(self):
        data = {
            'inquiry_type': 'organization',
            'name': 'David Miller',
            'phone': '555-019-2834',
            'message': 'Clinic staffing inquiry.',
            'consent': True,
        }
        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_public_read_disallowed(self):
        # GET should be disallowed
        response = self.client.get(self.create_url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_health_check_endpoint(self):
        response = self.client.get(self.health_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"status": "healthy"})


class VacancyAPITests(APITestCase):
    def setUp(self):
        self.list_url = reverse('vacancy-list')
        
        # Create active, draft, and closed vacancies
        self.active_vacancy = Vacancy.objects.create(
            title="Speech Pathologist",
            slug="speech-language-pathologist",
            status="active",
            summary="Active SLP vacancy."
        )
        self.draft_vacancy = Vacancy.objects.create(
            title="Draft OT Role",
            slug="draft-ot-role",
            status="draft",
            summary="Draft OT vacancy."
        )
        
        # Create staff user
        self.staff_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin123'
        )
        self.token = Token.objects.create(user=self.staff_user)

    def test_public_list_active_only(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['slug'], 'speech-language-pathologist')

    def test_public_create_vacancy_disallowed(self):
        data = {
            'title': 'New PT',
            'slug': 'new-pt',
            'status': 'active',
            'summary': 'New vacancy summary'
        }
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_inquiry_create_auto_links_vacancy(self):
        create_inquiry_url = reverse('inquiry-create')
        data = {
            'inquiry_type': 'therapist',
            'name': 'James Miller',
            'email': 'james@example.com',
            'message': 'Applying for SLP',
            'consent': True,
            'vacancy_context': 'speech-language-pathologist'
        }
        response = self.client.post(create_inquiry_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        inquiry = Inquiry.objects.get(name='James Miller')
        self.assertEqual(inquiry.vacancy, self.active_vacancy)
        self.assertEqual(inquiry.vacancy_context, 'speech-language-pathologist')

    def test_admin_endpoints_require_token(self):
        admin_inquiries_url = reverse('admin-inquiry-list')
        response = self.client.get(admin_inquiries_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_staff_can_manage_data(self):
        # List inquiries as admin
        admin_inquiries_url = reverse('admin-inquiry-list')
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        response = self.client.get(admin_inquiries_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Create vacancy as admin
        admin_vacancies_url = reverse('admin-vacancy-list')
        data = {
            'title': 'Behavioral Therapist',
            'slug': 'behavioral-therapist',
            'status': 'active',
            'summary': 'BCBA clinical job description.'
        }
        response = self.client.post(admin_vacancies_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Vacancy.objects.filter(slug='behavioral-therapist').count(), 1)


class PartnerRegistrationAPITests(APITestCase):
    def setUp(self):
        self.register_url = reverse('partner-register')

    def test_register_partner_success(self):
        data = {
            'name': 'John Doe',
            'email': 'john@partner.com',
            'phone_number': '1234567890',
            'password': 'password123',
            'confirm_password': 'password123',
            'company_name': 'Global Recruitment Ltd',
            'website': 'https://globalrec.com',
            'country': 'United Kingdom'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email='john@partner.com').exists())
        user = User.objects.get(email='john@partner.com')
        self.assertEqual(user.first_name, 'John')
        self.assertEqual(user.last_name, 'Doe')
        self.assertEqual(user.partner_profile.company_name, 'Global Recruitment Ltd')
        self.assertEqual(user.partner_profile.phone_number, '1234567890')
        self.assertEqual(user.partner_profile.website, 'https://globalrec.com')
        self.assertEqual(user.partner_profile.country, 'United Kingdom')

    def test_register_partner_password_mismatch(self):
        data = {
            'name': 'John Doe',
            'email': 'john@partner.com',
            'phone_number': '1234567890',
            'password': 'password123',
            'confirm_password': 'different_password',
            'company_name': 'Global Recruitment Ltd',
            'website': 'https://globalrec.com',
            'country': 'United Kingdom'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('confirm_password', response.data)

    def test_register_partner_duplicate_email(self):
        # Create existing user
        User.objects.create_user(username='existing@partner.com', email='existing@partner.com', password='password123')
        data = {
            'name': 'Another User',
            'email': 'existing@partner.com',
            'phone_number': '1234567890',
            'password': 'password123',
            'confirm_password': 'password123',
            'company_name': 'Another Agency',
            'website': '',
            'country': 'India'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)


class AdminPartnerListViewTests(APITestCase):
    def setUp(self):
        self.list_url = reverse('admin-partners-list')
        
        # Create standard user with partner profile
        self.partner_user = User.objects.create_user(
            username='partner@test.com',
            email='partner@test.com',
            password='password123',
            first_name='Jane',
            last_name='Partner'
        )
        self.profile = PartnerProfile.objects.create(
            user=self.partner_user,
            phone_number='1234567890',
            company_name='Partner Agency Inc.',
            website='https://partneragency.com',
            country='Canada'
        )
        
        # Create token for authentication
        self.partner_token, _ = Token.objects.get_or_create(user=self.partner_user)
        
        # Create staff user
        self.staff_user = User.objects.create_superuser(
            username='admin@test.com',
            email='admin@test.com',
            password='password123'
        )
        self.staff_token, _ = Token.objects.get_or_create(user=self.staff_user)

    def test_list_partners_unauthenticated(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_partners_non_staff_forbidden(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.partner_token.key)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_partners_staff_success(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.staff_token.key)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['company_name'], 'Partner Agency Inc.')
        self.assertEqual(response.data[0]['name'], 'Jane Partner')
        self.assertEqual(response.data[0]['country'], 'Canada')


