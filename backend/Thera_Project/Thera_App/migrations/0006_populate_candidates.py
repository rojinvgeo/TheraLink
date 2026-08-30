from django.db import migrations

def populate_mock_candidates(apps, schema_editor):
    Candidate = apps.get_model('Thera_App', 'Candidate')
    
    mock_candidates = [
        {
            'first_name': 'Arjun',
            'last_name': 'Mehta',
            'email': 'arjun.mehta@example.com',
            'phone_number': '+1 555-0101',
            'job_role': 'Speech Therapist',
            'location': 'New York',
            'experience_years': 5,
            'skills': 'Speech Therapy, Pediatrics, Autism Spectrum, AAC',
            'bio': 'Dedicated pediatric speech-language pathologist specializing in early intervention and autism spectrum communication support.'
        },
        {
            'first_name': 'Priya',
            'last_name': 'Sharma',
            'email': 'priya.sharma@example.com',
            'phone_number': '+1 555-0102',
            'job_role': 'Occupational Therapist',
            'location': 'Chicago',
            'experience_years': 3,
            'skills': 'Sensory Integration, Fine Motor Skills, ADHD, Autism Spectrum',
            'bio': 'Passionate occupational therapist with strong clinical experience in sensory processing disorders and pediatric milestone training.'
        },
        {
            'first_name': 'Sarah',
            'last_name': 'Jenkins',
            'email': 'sarah.jenkins@example.com',
            'phone_number': '+1 555-0103',
            'job_role': 'Physical Therapist',
            'location': 'Boston',
            'experience_years': 7,
            'skills': 'Pediatric Mobility, Developmental Milestones, Orthotics, Neurorehabilitation',
            'bio': 'Clinical physical therapist with extensive background in motor delay rehabilitation and custom orthotic evaluations for school systems.'
        },
        {
            'first_name': 'David',
            'last_name': 'Miller',
            'email': 'david.miller@example.com',
            'phone_number': '+1 555-0104',
            'job_role': 'Behavioral Therapist',
            'location': 'San Francisco',
            'experience_years': 4,
            'skills': 'ABA Therapy, Autism Spectrum, Positive Reinforcement, Behavior Modification',
            'bio': 'Board Certified Behavior Analyst (BCBA) dedicated to early-intervention behavioral therapies and family coaching support.'
        },
        {
            'first_name': 'Aisha',
            'last_name': 'Rahman',
            'email': 'aisha.rahman@example.com',
            'phone_number': '+1 555-0105',
            'job_role': 'Speech Therapist',
            'location': 'Chicago',
            'experience_years': 6,
            'skills': 'Dysphagia, Speech Therapy, Fluency, Articulatory Disorders',
            'bio': 'Experienced therapist specialized in speech sound disorders, feeding therapies, and fluency remediation.'
        },
        {
            'first_name': 'Liam',
            'last_name': 'O\'Connor',
            'email': 'liam.oconnor@example.com',
            'phone_number': '+1 555-0106',
            'job_role': 'Occupational Therapist',
            'location': 'New York',
            'experience_years': 2,
            'skills': 'Fine Motor Skills, Cognitive Rehabilitation, Adaptive Devices',
            'bio': 'Empathetic occupational therapist helping young learners develop independent life skills through engaging adaptive activities.'
        },
        {
            'first_name': 'Rohan',
            'last_name': 'Gupta',
            'email': 'rohan.gupta@example.com',
            'phone_number': '+1 555-0107',
            'job_role': 'Behavioral Therapist',
            'location': 'Boston',
            'experience_years': 8,
            'skills': 'ABA Therapy, Crisis Intervention, Social Skills Training, IEP Planning',
            'bio': 'Senior behavioral specialist with specialized training in classroom positive behavior support plans and group social skill instruction.'
        }
    ]
    
    for candidate_data in mock_candidates:
        Candidate.objects.get_or_create(
            email=candidate_data['email'],
            defaults=candidate_data
        )

def remove_mock_candidates(apps, schema_editor):
    Candidate = apps.get_model('Thera_App', 'Candidate')
    Candidate.objects.all().delete()

class Migration(migrations.Migration):

    dependencies = [
        ('Thera_App', '0005_candidate_candidaterequest'),
    ]

    operations = [
        migrations.RunPython(populate_mock_candidates, remove_mock_candidates),
    ]
