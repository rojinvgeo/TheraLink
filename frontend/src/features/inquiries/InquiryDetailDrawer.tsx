import type { ReactNode, ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  User, 
  Calendar,
  MessageSquare,
  FileText,
  Check,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import { updateInquiry } from '../../api/inquiries';
import type { Inquiry } from '../../api/inquiries';
import { Badge } from '../../components/ui';

interface InquiryDetailDrawerProps {
  inquiry: Inquiry | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateInquiry: () => void;
}

export function InquiryDetailDrawer({
  inquiry,
  isOpen,
  onClose,
  onUpdateInquiry
}: InquiryDetailDrawerProps): ReactNode {
  const [status, setStatus] = useState<Inquiry['status']>('new');
  const [notes, setNotes] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Sync internal state when active inquiry changes
  useEffect(() => {
    if (inquiry) {
      setStatus(inquiry.status);
      setNotes(inquiry.internal_notes || '');
      setSaveStatus('idle');
    }
  }, [inquiry]);

  if (!inquiry) return null;

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Inquiry['status'];
    setStatus(newStatus);
    setSaveStatus('saving');
    updateInquiry(inquiry.id, { status: newStatus })
      .then(() => {
        setSaveStatus('saved');
        onUpdateInquiry();
      })
      .catch((err) => {
        console.error('Failed to update inquiry status:', err);
        setSaveStatus('idle');
      });
  };

  const handleNotesBlur = (e: any) => {
    if (e && e.target) {
      e.target.style.borderColor = 'var(--color-border-base, #e2e8f0)';
      e.target.style.boxShadow = 'none';
    }

    if (notes === (inquiry.internal_notes || '')) return;
    
    setSaveStatus('saving');
    updateInquiry(inquiry.id, { internal_notes: notes })
      .then(() => {
        setSaveStatus('saved');
        onUpdateInquiry();
      })
      .catch((err) => {
        console.error('Failed to update inquiry notes:', err);
        setSaveStatus('idle');
      });
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const getTypeLabel = (type: Inquiry['inquiry_type']) => {
    switch (type) {
      case 'organization': return 'Healthcare Organization / Provider';
      case 'family': return 'Family / Caregiver';
      case 'therapist': return 'Therapist Candidate';
      default: return 'General / Other';
    }
  };

  const getTypeBadge = (type: Inquiry['inquiry_type']) => {
    switch (type) {
      case 'organization': return <Badge variant="teal">Organization</Badge>;
      case 'family': return <Badge variant="orange">Family</Badge>;
      case 'therapist': return <Badge variant="purple">Therapist</Badge>;
      default: return <Badge variant="blue">Other</Badge>;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: '#000000',
              zIndex: 100,
            }}
          />

          {/* Slide-over Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 250 }}
            style={{
              position: 'fixed',
              top: 0,
              bottom: 0,
              right: 0,
              width: '100%',
              maxWidth: '520px',
              backgroundColor: 'var(--color-canvas-base, #ffffff)',
              boxShadow: 'var(--shadow-xl)',
              zIndex: 110,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              borderLeft: '1px solid var(--color-border-base, #e2e8f0)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: 'var(--space-6)',
              borderBottom: '1px solid var(--color-border-base, #e2e8f0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary, #0f172a)',
                }}>
                  Inquiry Details
                </h3>
                <span style={{
                  fontSize: '0.8rem',
                  color: 'var(--color-text-muted, #94a3b8)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '4px'
                }}>
                  <Calendar size={12} />
                  Submitted {formatDate(inquiry.created_at)}
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close drawer"
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
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-border-base, #e2e8f0)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-canvas-alt, #f8fafc)'}
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div style={{
              flex: 1,
              padding: 'var(--space-6)',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-6)',
            }}>
              {/* Status Triage Section */}
              <div style={{
                backgroundColor: 'var(--color-canvas-alt, #f8fafc)',
                padding: 'var(--space-4)',
                borderRadius: '8px',
                border: '1px solid var(--color-border-base, #e2e8f0)',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--space-4)',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <label htmlFor="triage-status" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary, #475569)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Triage Status
                  </label>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted, #94a3b8)' }}>Immediate database update</span>
                </div>
                <select
                  id="triage-status"
                  value={status}
                  onChange={handleStatusChange}
                  style={{
                    padding: '8px 12px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    borderRadius: '6px',
                    border: '1px solid var(--color-border-base, #e2e8f0)',
                    backgroundColor: 'var(--color-canvas-base, #ffffff)',
                    outline: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-primary, #0f172a)',
                    minWidth: '140px',
                  }}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="unqualified">Unqualified</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Core Information Section */}
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-secondary, #475569)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-3)' }}>
                  Inquirer Profile
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {/* Name and Type */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2.5)' }}>
                      <User size={18} style={{ color: 'var(--color-text-muted, #94a3b8)' }} />
                      <span style={{ fontWeight: 600, color: 'var(--color-text-primary, #0f172a)' }}>{inquiry.name}</span>
                    </div>
                    {getTypeBadge(inquiry.inquiry_type)}
                  </div>

                  {/* Type description detail */}
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary, #64748b)', paddingLeft: '28px', marginTop: '-4px' }}>
                    Role: {getTypeLabel(inquiry.inquiry_type)}
                  </div>

                  {/* Email */}
                  {inquiry.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2.5)' }}>
                      <Mail size={18} style={{ color: 'var(--color-text-muted, #94a3b8)' }} />
                      <a href={`mailto:${inquiry.email}`} style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        {inquiry.email}
                      </a>
                    </div>
                  )}

                  {/* Phone */}
                  {inquiry.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2.5)' }}>
                      <Phone size={18} style={{ color: 'var(--color-text-muted, #94a3b8)' }} />
                      <a href={`tel:${inquiry.phone}`} style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-secondary, #475569)' }}>
                        {inquiry.phone}
                      </a>
                    </div>
                  )}

                  {/* Location */}
                  {inquiry.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2.5)' }}>
                      <MapPin size={18} style={{ color: 'var(--color-text-muted, #94a3b8)' }} />
                      <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary, #475569)' }}>
                        {inquiry.location}
                      </span>
                    </div>
                  )}

                  {/* Organization name */}
                  {inquiry.organization_name && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2.5)' }}>
                      <Building size={18} style={{ color: 'var(--color-text-muted, #94a3b8)' }} />
                      <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary, #475569)' }}>
                        {inquiry.organization_name} {inquiry.role_or_profession ? `(${inquiry.role_or_profession})` : ''}
                      </span>
                    </div>
                  )}

                  {/* Therapist type needed */}
                  {inquiry.therapist_type_needed && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2.5)' }}>
                      <HelpCircle size={18} style={{ color: 'var(--color-text-muted, #94a3b8)' }} />
                      <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary, #475569)' }}>
                        Target Therapist: <strong style={{ fontWeight: 600 }}>{inquiry.therapist_type_needed}</strong>
                      </span>
                    </div>
                  )}

                  {/* Vacancy Context */}
                  {inquiry.vacancy_context && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2.5)' }}>
                      <Briefcase size={18} style={{ color: 'var(--color-text-muted, #94a3b8)' }} />
                      <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary, #475569)' }}>
                        Vacancy Context: <Badge variant="blue">{inquiry.vacancy_context}</Badge>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Inquiry Message bubble */}
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-secondary, #475569)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-3)' }}>
                  Message Submitted
                </h4>
                <div style={{
                  backgroundColor: 'var(--color-brand-blue-tint, #eff6ff)',
                  borderLeft: '4px solid var(--color-brand-blue, #3b82f6)',
                  borderRadius: '0 8px 8px 0',
                  padding: 'var(--space-4)',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  color: 'var(--color-text-primary, #0f172a)',
                  fontStyle: 'italic',
                  position: 'relative',
                }}>
                  <MessageSquare size={16} style={{
                    position: 'absolute',
                    right: '12px',
                    top: '12px',
                    color: 'rgba(59, 130, 246, 0.2)',
                  }} />
                  "{inquiry.message}"
                </div>
              </div>

              {/* Internal Notes area */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label htmlFor="internal-notes" style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-secondary, #475569)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={16} />
                    Internal Notes
                  </label>

                  {/* Auto-save status feedback banner */}
                  <div style={{ transition: 'opacity 0.2s ease', opacity: saveStatus === 'idle' ? 0.4 : 1 }}>
                    {saveStatus === 'idle' && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted, #94a3b8)' }}>Auto-saves on blur</span>
                    )}
                    {saveStatus === 'saving' && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-brand-blue, #2563eb)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Saving changes...
                      </span>
                    )}
                    {saveStatus === 'saved' && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-success, #10b981)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={14} /> Saved successfully
                      </span>
                    )}
                  </div>
                </div>
                <textarea
                  id="internal-notes"
                  placeholder="Type internal notes here (e.g. details of follow-up call, candidate qualifications, interview details)..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onBlur={handleNotesBlur}
                  style={{
                    width: '100%',
                    minHeight: '140px',
                    padding: 'var(--space-3)',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-sans)',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border-base, #e2e8f0)',
                    outline: 'none',
                    resize: 'vertical',
                    backgroundColor: 'var(--color-canvas-base, #ffffff)',
                    color: 'var(--color-text-primary, #0f172a)',
                    lineHeight: 1.5,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-accent-purple, #8b5cf6)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.15)';
                    if (saveStatus === 'saved') {
                      setSaveStatus('idle');
                    }
                  }}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default InquiryDetailDrawer;
