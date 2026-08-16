import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/layout';
import { InquiriesTriagePanel } from '../features/inquiries/InquiriesTriagePanel';
import { InquiryDetailDrawer } from '../features/inquiries/InquiryDetailDrawer';
import { VacanciesAdminPanel } from '../features/vacancies/VacanciesAdminPanel';
import type { Inquiry } from '../api/inquiries';
import { getInquiries } from '../api/inquiries';
import type { Vacancy } from '../features/vacancies/vacancyTypes';
import { getVacancies, createVacancy, updateVacancy } from '../api/vacancies';

export default function AdminDashboardPage(): ReactNode {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'inquiries' | 'vacancies'>('inquiries');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);

  const loadInquiries = () => {
    getInquiries()
      .then(setInquiries)
      .catch(err => console.error('Failed to load inquiries:', err));
  };

  const loadVacancies = () => {
    getVacancies(false)
      .then(setVacancies)
      .catch(err => console.error('Failed to load vacancies:', err));
  };

  useEffect(() => {
    document.title = 'Dashboard | TheraLink Admin';

    // Simple Route Protection Guard check
    if (!localStorage.getItem('theralink_admin_token')) {
      navigate('/admin/login', { replace: true });
    } else {
      loadInquiries();
      loadVacancies();
    }
  }, [navigate]);

  const handleSelectInquiry = (inquiry: Inquiry) => {
    setSelectedInquiryId(inquiry.id);
  };

  const handleCloseDrawer = () => {
    setSelectedInquiryId(null);
  };

  const handleUpdateInquiries = () => {
    loadInquiries();
  };

  // Vacancy Handlers
  const handleCreateVacancy = (input: Omit<Vacancy, 'id' | 'postedAt'>) => {
    createVacancy(input)
      .then(setVacancies)
      .catch(err => console.error('Failed to create vacancy:', err));
  };

  const handleUpdateVacancy = (id: string, updates: Partial<Vacancy>) => {
    updateVacancy(id, updates)
      .then(setVacancies)
      .catch(err => console.error('Failed to update vacancy:', err));
  };

  const activeInquiry = inquiries.find(iq => iq.id === selectedInquiryId) || null;

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'inquiries' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Header Panel */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-1)'
          }}>
            <h2 style={{
              fontSize: '1.75rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              color: 'var(--color-text-primary, #0f172a)'
            }}>
              Inquiries Triage
            </h2>
            <p style={{
              color: 'var(--color-text-secondary, #64748b)',
              fontSize: '0.95rem'
            }}>
              Monitor, triage, and manage incoming therapist and client inquiries.
            </p>
          </div>

          {/* Interactive Inquiries Panel */}
          <InquiriesTriagePanel
            inquiries={inquiries}
            selectedInquiryId={selectedInquiryId}
            onSelectInquiry={handleSelectInquiry}
          />

          {/* Inquiry Slide-over Detail Drawer */}
          <InquiryDetailDrawer
            inquiry={activeInquiry}
            isOpen={selectedInquiryId !== null}
            onClose={handleCloseDrawer}
            onUpdateInquiry={handleUpdateInquiries}
          />
        </div>
      ) : (
        <VacanciesAdminPanel
          vacancies={vacancies}
          onCreateVacancy={handleCreateVacancy}
          onUpdateVacancy={handleUpdateVacancy}
        />
      )}
    </AdminLayout>
  );
}
