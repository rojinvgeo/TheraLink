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
import type { PartnerDetail } from '../api/partners';
import { getAdminPartners } from '../api/partners';
import { Search, Globe, Phone, Mail, Calendar, Building, ExternalLink, Users } from 'lucide-react';

export default function AdminDashboardPage(): ReactNode {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'inquiries' | 'vacancies' | 'partners'>('inquiries');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [partners, setPartners] = useState<PartnerDetail[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
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

  const loadPartners = () => {
    getAdminPartners()
      .then(setPartners)
      .catch(err => console.error('Failed to load partners:', err));
  };

  useEffect(() => {
    document.title = 'Dashboard | TheraLink Admin';

    // Simple Route Protection Guard check
    if (!localStorage.getItem('theralink_admin_token')) {
      navigate('/admin/login', { replace: true });
    } else {
      loadInquiries();
      loadVacancies();
      loadPartners();
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

  const filteredPartners = partners.filter(p => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      p.company_name?.toLowerCase().includes(query) ||
      p.name?.toLowerCase().includes(query) ||
      p.email?.toLowerCase().includes(query) ||
      p.country?.toLowerCase().includes(query)
    );
  });

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
      ) : activeTab === 'vacancies' ? (
        <VacanciesAdminPanel
          vacancies={vacancies}
          onCreateVacancy={handleCreateVacancy}
          onUpdateVacancy={handleUpdateVacancy}
        />
      ) : (
        /* PARTNERS DASHBOARD PANEL */
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
              Registered Partners
            </h2>
            <p style={{
              color: 'var(--color-text-secondary, #64748b)',
              fontSize: '0.95rem'
            }}>
              View and manage registered Recruitment Partner agencies.
            </p>
          </div>

          {/* Search Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--color-canvas-base, #ffffff)',
            borderRadius: '12px',
            padding: 'var(--space-3) var(--space-4)',
            border: '1px solid var(--color-border-base, #e2e8f0)',
            boxShadow: 'var(--shadow-sm)',
            gap: 'var(--space-2)'
          }}>
            <Search size={18} style={{ color: 'var(--color-text-muted, #94a3b8)' }} />
            <input 
              type="text"
              placeholder="Search by company name, contact name, email, or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-sans)',
                color: 'var(--color-text-primary, #0f172a)'
              }}
            />
          </div>

          {/* Partners Table Card */}
          <div style={{
            backgroundColor: 'var(--color-canvas-base, #ffffff)',
            borderRadius: '16px',
            border: '1px solid var(--color-border-base, #e2e8f0)',
            boxShadow: 'var(--shadow-md)',
            overflow: 'hidden'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.9rem'
              }}>
                <thead>
                  <tr style={{
                    borderBottom: '1px solid var(--color-border-base, #e2e8f0)',
                    backgroundColor: 'var(--color-canvas-alt, #f8fafc)',
                    color: 'var(--color-text-secondary, #475569)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '0.05em'
                  }}>
                    <th style={{ padding: 'var(--space-4) var(--space-6)' }}>Company</th>
                    <th style={{ padding: 'var(--space-4) var(--space-6)' }}>Contact Person</th>
                    <th style={{ padding: 'var(--space-4) var(--space-6)' }}>Country</th>
                    <th style={{ padding: 'var(--space-4) var(--space-6)' }}>Contact Details</th>
                    <th style={{ padding: 'var(--space-4) var(--space-6)' }}>Website</th>
                    <th style={{ padding: 'var(--space-4) var(--space-6)' }}>Joined Date</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'var(--color-text-primary, #0f172a)' }}>
                  {filteredPartners.length > 0 ? (
                    filteredPartners.map((partner) => (
                      <tr 
                        key={partner.id}
                        style={{
                          borderBottom: '1px solid var(--color-border-base, #f1f5f9)',
                          transition: 'background-color 0.2s ease',
                          cursor: 'default'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--color-canvas-alt, #f8fafc)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <td style={{ padding: 'var(--space-4) var(--space-6)', fontWeight: 600 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <Building size={16} style={{ color: 'var(--color-accent-purple, #8b5cf6)' }} />
                            {partner.company_name}
                          </div>
                        </td>
                        <td style={{ padding: 'var(--space-4) var(--space-6)' }}>
                          {partner.name}
                        </td>
                        <td style={{ padding: 'var(--space-4) var(--space-6)' }}>
                          <span style={{
                            padding: 'var(--space-1) var(--space-2.5)',
                            borderRadius: '20px',
                            backgroundColor: 'var(--color-accent-purple-tint, #f5f3ff)',
                            color: 'var(--color-accent-purple, #8b5cf6)',
                            fontWeight: 600,
                            fontSize: '0.75rem'
                          }}>
                            {partner.country}
                          </span>
                        </td>
                        <td style={{ padding: 'var(--space-4) var(--space-6)' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <a 
                              href={`mailto:${partner.email}`} 
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '6px', 
                                color: 'var(--color-accent-purple, #8b5cf6)', 
                                textDecoration: 'none' 
                              }}
                            >
                              <Mail size={12} />
                              {partner.email}
                            </a>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-secondary, #64748b)' }}>
                              <Phone size={12} />
                              {partner.phone_number}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: 'var(--space-4) var(--space-6)' }}>
                          {partner.website ? (
                            <a 
                              href={partner.website.startsWith('http') ? partner.website : `https://${partner.website}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                color: 'var(--color-accent-purple, #8b5cf6)',
                                textDecoration: 'none'
                              }}
                            >
                              <Globe size={14} />
                              {partner.website.replace(/(^\w+:|^)\/\//, '')}
                              <ExternalLink size={10} />
                            </a>
                          ) : (
                            <span style={{ color: 'var(--color-text-muted, #94a3b8)', fontStyle: 'italic' }}>None</span>
                          )}
                        </td>
                        <td style={{ padding: 'var(--space-4) var(--space-6)', color: 'var(--color-text-secondary, #64748b)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={14} />
                            {new Date(partner.date_joined).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{
                        padding: 'var(--space-12) var(--space-6)',
                        textAlign: 'center',
                        color: 'var(--color-text-muted, #94a3b8)'
                      }}>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 'var(--space-2)'
                        }}>
                          <Users size={32} style={{ color: 'var(--color-border-base, #cbd5e1)' }} />
                          <p style={{ fontWeight: 600 }}>No partners found</p>
                          <p style={{ fontSize: '0.85rem' }}>
                            {searchQuery ? 'Try clearing or changing your search term.' : 'Registered partner profiles will show up here.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
