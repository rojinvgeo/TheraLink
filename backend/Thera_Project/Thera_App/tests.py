from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import Inquiry, Vacancy
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
