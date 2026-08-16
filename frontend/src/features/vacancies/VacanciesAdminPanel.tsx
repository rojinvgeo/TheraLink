import type { ReactNode, FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { Plus, Edit3, MapPin, Briefcase, X, FileText } from 'lucide-react';
import type { Vacancy } from './vacancyTypes';
import { Card, Button, Badge } from '../../components/ui';

interface VacanciesAdminPanelProps {
  vacancies: Vacancy[];
  onCreateVacancy: (input: Omit<Vacancy, 'id' | 'postedAt'>) => void;
  onUpdateVacancy: (id: string, updates: Partial<Vacancy>) => void;
}

export function VacanciesAdminPanel({
  vacancies,
  onCreateVacancy,
  onUpdateVacancy
}: VacanciesAdminPanelProps): ReactNode {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState<Vacancy['employmentType']>('full_time');
  const [status, setStatus] = useState<Vacancy['status']>('draft');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Generate slug dynamically from title if creating
  useEffect(() => {
    if (!editingVacancy && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  }, [title, editingVacancy]);

  const openCreateModal = () => {
    setEditingVacancy(null);
    setTitle('');
    setSlug('');
    setLocation('');
    setEmploymentType('full_time');
    setStatus('draft');
    setSummary('');
    setDescription('');
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (vacancy: Vacancy) => {
    setEditingVacancy(vacancy);
    setTitle(vacancy.title);
    setSlug(vacancy.slug);
    setLocation(vacancy.location || '');
    setEmploymentType(vacancy.employmentType || 'full_time');
    setStatus(vacancy.status || 'draft');
    setSummary(vacancy.summary);
    setDescription(vacancy.description || '');
    setError(null);
    setModalOpen(true);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validations
    if (!title.trim() || !slug.trim() || !summary.trim()) {
      setError('Please fill in all required fields (Title, Slug, and Summary).');
      return;
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      location: location.trim() || undefined,
      employmentType,
      status,
      summary: summary.trim(),
      description: description.trim() || undefined,
    };

    if (editingVacancy) {
      onUpdateVacancy(editingVacancy.id, payload);
    } else {
      onCreateVacancy(payload);
    }

    setModalOpen(false);
  };

  const getEmploymentTypeLabel = (type?: string) => {
    switch (type) {
      case 'full_time': return 'Full Time';
      case 'part_time': return 'Part Time';
      case 'contract': return 'Contract';
      case 'temporary': return 'Temporary';
      case 'other': return 'Other';
      default: return type || '';
    }
  };

  // Status Badge styling helper
  const getStatusBadge = (status: Vacancy['status']) => {
    const s = status || 'draft';
    switch (s) {
      case 'active':
        return (
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            backgroundColor: '#d1fae5',
            color: '#059669',
          }}>
            Active
          </span>
        );
      case 'draft':
        return (
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            backgroundColor: '#fef3c7',
            color: '#d97706',
          }}>
            Draft
          </span>
        );
      case 'closed':
        return (
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            backgroundColor: '#f3f4f6',
            color: '#4b5563',
          }}>
            Closed
          </span>
        );
      case 'archived':
        return (
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
          }}>
            Archived
          </span>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* 1. Header Toolbar */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-4)',
        borderBottom: '1px solid var(--color-border-base, #e2e8f0)',
        paddingBottom: 'var(--space-4)',
      }}>
        <div>
          <h2 style={{
            fontSize: '1.75rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            color: 'var(--color-text-primary, #0f172a)'
          }}>
            Vacancies Publisher
          </h2>
          <p style={{ color: 'var(--color-text-secondary, #64748b)', fontSize: '0.95rem', marginTop: '2px' }}>
            Publish and manage open clinical assignments and therapist placements.
          </p>
        </div>
        <Button
          variant="purple"
          onClick={openCreateModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            backgroundColor: 'var(--color-accent-purple, #8b5cf6)',
            borderColor: 'var(--color-accent-purple, #8b5cf6)',
          }}
        >
          <Plus size={18} />
          <span>Create Vacancy</span>
        </Button>
      </div>

      {/* 2. Admin Cards Grid */}
      {vacancies.length === 0 ? (
        <Card style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-12) var(--space-6)',
          textAlign: 'center',
          minHeight: '280px',
        }}>
          <FileText size={40} style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>No Vacancies Registered</h3>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px', fontSize: '0.9rem', marginTop: '8px', marginBottom: 'var(--space-6)' }}>
            Start by creating a new therapist recruitment opportunity to publish to the site.
          </p>
          <Button variant="purple" onClick={openCreateModal} icon={<Plus size={16} />}>Create Vacancy</Button>
        </Card>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 'var(--space-6)',
        }}>
          {vacancies.map((vacancy) => (
            <Card
              key={vacancy.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '220px',
                padding: 'var(--space-6)',
                backgroundColor: 'var(--color-canvas-base, #ffffff)',
                border: '1px solid var(--color-border-base, #e2e8f0)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {/* Header title & status */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    color: 'var(--color-text-primary, #0f172a)',
                    lineHeight: 1.3,
                  }}>
                    {vacancy.title}
                  </h3>
                  {getStatusBadge(vacancy.status)}
                </div>

                {/* Subtitle details */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: '2px' }}>
                  {vacancy.location && (
                    <Badge variant="blue" icon={<MapPin size={12} />}>
                      {vacancy.location}
                    </Badge>
                  )}
                  {vacancy.employmentType && (
                    <Badge variant="purple" icon={<Briefcase size={12} />}>
                      {getEmploymentTypeLabel(vacancy.employmentType)}
                    </Badge>
                  )}
                </div>

                {/* Summary */}
                <p style={{
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  color: 'var(--color-text-secondary, #475569)',
                  marginTop: '4px',
                }}>
                  {vacancy.summary}
                </p>
              </div>

              {/* Edit button */}
              <div style={{
                marginTop: 'var(--space-6)',
                borderTop: '1px solid var(--color-border-base, #e2e8f0)',
                paddingTop: 'var(--space-4)',
                display: 'flex',
                justifyContent: 'flex-end',
              }}>
                <button
                  onClick={() => openEditModal(vacancy)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--color-accent-purple, #8b5cf6)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--color-accent-purple-tint, #f5f3ff)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-border-base, #e2e8f0)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-accent-purple-tint, #f5f3ff)'}
                >
                  <Edit3 size={14} />
                  <span>Edit Position</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 3. Form Modal overlay */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-4)',
        }}>
          {/* Modal Container */}
          <div style={{
            width: '100%',
            maxWidth: '560px',
            backgroundColor: 'var(--color-canvas-base, #ffffff)',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-xl)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh',
            border: '1px solid var(--color-border-base, #e2e8f0)',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: 'var(--space-5) var(--space-6)',
              borderBottom: '1px solid var(--color-border-base, #e2e8f0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--color-text-primary, #0f172a)',
              }}>
                {editingVacancy ? 'Edit Placement' : 'Publish New Placement'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  background: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-secondary, #64748b)',
                  padding: 'var(--space-1.5)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--color-canvas-alt, #f8fafc)',
                  border: '1px solid var(--color-border-base, #e2e8f0)',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              overflowY: 'auto',
            }}>
              {/* Form Body */}
              <div style={{
                padding: 'var(--space-6)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)',
              }}>
                {error && (
                  <div style={{
                    padding: 'var(--space-3) var(--space-4)',
                    backgroundColor: '#fee2e2',
                    border: '1px solid rgba(220, 38, 38, 0.2)',
                    color: '#dc2626',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}>
                    {error}
                  </div>
                )}

                {/* Title */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label htmlFor="vacancy-title" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary, #475569)' }}>
                    Title <span style={{ color: 'var(--color-error, #ef4444)' }}>*</span>
                  </label>
                  <input
                    id="vacancy-title"
                    type="text"
                    required
                    placeholder="e.g. Speech-Language Pathologist (SLP)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{
                      padding: '10px 12px',
                      fontSize: '0.95rem',
                      border: '1px solid var(--color-border-base, #e2e8f0)',
                      borderRadius: '6px',
                      outline: 'none',
                      fontFamily: 'var(--font-sans)',
                      backgroundColor: 'var(--color-canvas-base, #ffffff)',
                    }}
                  />
                </div>

                {/* Slug */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label htmlFor="vacancy-slug" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary, #475569)' }}>
                    Slug URL <span style={{ color: 'var(--color-error, #ef4444)' }}>*</span>
                  </label>
                  <input
                    id="vacancy-slug"
                    type="text"
                    required
                    placeholder="e.g. speech-language-pathologist"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    style={{
                      padding: '10px 12px',
                      fontSize: '0.95rem',
                      border: '1px solid var(--color-border-base, #e2e8f0)',
                      borderRadius: '6px',
                      outline: 'none',
                      fontFamily: 'var(--font-sans)',
                      backgroundColor: 'var(--color-canvas-base, #ffffff)',
                    }}
                  />
                </div>

                {/* Type & Status Double Row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'var(--space-4)',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label htmlFor="vacancy-type" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary, #475569)' }}>
                      Employment Type
                    </label>
                    <select
                      id="vacancy-type"
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value as any)}
                      style={{
                        padding: '10px 12px',
                        fontSize: '0.95rem',
                        border: '1px solid var(--color-border-base, #e2e8f0)',
                        borderRadius: '6px',
                        backgroundColor: 'var(--color-canvas-base, #ffffff)',
                        outline: 'none',
                      }}
                    >
                      <option value="full_time">Full Time</option>
                      <option value="part_time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="temporary">Temporary</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label htmlFor="vacancy-status" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary, #475569)' }}>
                      Publisher Status
                    </label>
                    <select
                      id="vacancy-status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      style={{
                        padding: '10px 12px',
                        fontSize: '0.95rem',
                        border: '1px solid var(--color-border-base, #e2e8f0)',
                        borderRadius: '6px',
                        backgroundColor: 'var(--color-canvas-base, #ffffff)',
                        outline: 'none',
                      }}
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active (Visible Publicly)</option>
                      <option value="closed">Closed</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label htmlFor="vacancy-location" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary, #475569)' }}>
                    Location
                  </label>
                  <input
                    id="vacancy-location"
                    type="text"
                    placeholder="e.g. Brooklyn, NY (On-site) or Hybrid"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{
                      padding: '10px 12px',
                      fontSize: '0.95rem',
                      border: '1px solid var(--color-border-base, #e2e8f0)',
                      borderRadius: '6px',
                      outline: 'none',
                      fontFamily: 'var(--font-sans)',
                      backgroundColor: 'var(--color-canvas-base, #ffffff)',
                    }}
                  />
                </div>

                {/* Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label htmlFor="vacancy-summary" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary, #475569)' }}>
                    Short Summary <span style={{ color: 'var(--color-error, #ef4444)' }}>*</span>
                  </label>
                  <textarea
                    id="vacancy-summary"
                    required
                    placeholder="Provide a brief one-to-two sentence overview of the placement role..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    style={{
                      padding: '10px 12px',
                      fontSize: '0.95rem',
                      border: '1px solid var(--color-border-base, #e2e8f0)',
                      borderRadius: '6px',
                      outline: 'none',
                      fontFamily: 'var(--font-sans)',
                      backgroundColor: 'var(--color-canvas-base, #ffffff)',
                      minHeight: '70px',
                      resize: 'vertical',
                    }}
                  />
                </div>

                {/* Description */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label htmlFor="vacancy-description" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary, #475569)' }}>
                    Full Description / Requirements
                  </label>
                  <textarea
                    id="vacancy-description"
                    placeholder="Enter role details, client requirements, scheduling assignments, certifications required..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{
                      padding: '10px 12px',
                      fontSize: '0.95rem',
                      border: '1px solid var(--color-border-base, #e2e8f0)',
                      borderRadius: '6px',
                      outline: 'none',
                      fontFamily: 'var(--font-sans)',
                      backgroundColor: 'var(--color-canvas-base, #ffffff)',
                      minHeight: '120px',
                      resize: 'vertical',
                    }}
                  />
                </div>
              </div>

              {/* Form Footer Actions */}
              <div style={{
                padding: 'var(--space-4) var(--space-6)',
                borderTop: '1px solid var(--color-border-base, #e2e8f0)',
                backgroundColor: 'var(--color-canvas-alt, #f8fafc)',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 'var(--space-3)',
              }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="purple"
                  style={{
                    backgroundColor: 'var(--color-accent-purple, #8b5cf6)',
                    borderColor: 'var(--color-accent-purple, #8b5cf6)',
                  }}
                >
                  {editingVacancy ? 'Save Opportunity' : 'Publish Opportunity'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default VacanciesAdminPanel;
