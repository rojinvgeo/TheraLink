import type { ReactNode } from 'react';
import { useState, useMemo } from 'react';
import { 
  Search, 
  Users, 
  AlertCircle, 
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react';
import type { Inquiry } from '../../api/inquiries';
import { Card, Badge } from '../../components/ui';

interface InquiriesTriagePanelProps {
  inquiries: Inquiry[];
  selectedInquiryId?: string | null;
  onSelectInquiry?: (inquiry: Inquiry) => void;
}

export function InquiriesTriagePanel({
  inquiries,
  selectedInquiryId,
  onSelectInquiry
}: InquiriesTriagePanelProps): ReactNode {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'contacted' | 'qualified' | 'closed'>('all');

  // Compute Metrics dynamically based on raw inquiries array
  const metrics = useMemo(() => {
    const total = inquiries.length;
    const newCount = inquiries.filter(iq => iq.status === 'new').length;
    const contactedCount = inquiries.filter(iq => iq.status === 'contacted').length;
    const qualifiedCount = inquiries.filter(iq => iq.status === 'qualified').length;
    
    return { total, newCount, contactedCount, qualifiedCount };
  }, [inquiries]);

  // Tab counts helper
  const tabCounts = useMemo(() => {
    return {
      all: inquiries.length,
      new: inquiries.filter(iq => iq.status === 'new').length,
      contacted: inquiries.filter(iq => iq.status === 'contacted').length,
      qualified: inquiries.filter(iq => iq.status === 'qualified').length,
      closed: inquiries.filter(iq => iq.status === 'closed').length
    };
  }, [inquiries]);

  // Filter & Search Logic
  const filteredInquiries = useMemo(() => {
    return inquiries.filter(iq => {
      // 1. Status Filter
      if (activeFilter !== 'all' && iq.status !== activeFilter) {
        return false;
      }
      
      // 2. Search Query Filter
      if (searchQuery.trim() === '') {
        return true;
      }
      
      const query = searchQuery.toLowerCase();
      const nameMatch = iq.name.toLowerCase().includes(query);
      const emailMatch = iq.email?.toLowerCase().includes(query) || false;
      const messageMatch = iq.message.toLowerCase().includes(query);
      const orgMatch = iq.organization_name?.toLowerCase().includes(query) || false;
      const roleMatch = iq.role_or_profession?.toLowerCase().includes(query) || false;
      
      return nameMatch || emailMatch || messageMatch || orgMatch || roleMatch;
    });
  }, [inquiries, searchQuery, activeFilter]);

  // Format date helper
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Badge styling helpers
  const getTypeBadge = (type: Inquiry['inquiry_type']) => {
    switch (type) {
      case 'organization':
        return <Badge variant="teal">Organization</Badge>;
      case 'family':
        return <Badge variant="orange">Family</Badge>;
      case 'therapist':
        return <Badge variant="purple">Therapist</Badge>;
      default:
        return <Badge variant="blue">Other</Badge>;
    }
  };

  const getStatusBadge = (status: Inquiry['status']) => {
    switch (status) {
      case 'new':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '2px 8px',
            borderRadius: '4px',
            backgroundColor: 'var(--color-accent-orange-tint, #fff7ed)',
            color: 'var(--color-accent-orange, #f97316)',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-accent-orange, #f97316)' }}></span>
            New
          </span>
        );
      case 'contacted':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '2px 8px',
            borderRadius: '4px',
            backgroundColor: 'var(--color-brand-blue-tint, #eff6ff)',
            color: 'var(--color-brand-blue, #3b82f6)',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-brand-blue, #3b82f6)' }}></span>
            Contacted
          </span>
        );
      case 'qualified':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '2px 8px',
            borderRadius: '4px',
            backgroundColor: 'var(--color-accent-teal-tint, #f0fdfa)',
            color: 'var(--color-accent-teal, #0d9488)',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-accent-teal, #0d9488)' }}></span>
            Qualified
          </span>
        );
      case 'unqualified':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '2px 8px',
            borderRadius: '4px',
            backgroundColor: '#fef2f2',
            color: 'var(--color-error, #ef4444)',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-error, #ef4444)' }}></span>
            Unqualified
          </span>
        );
      case 'closed':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '2px 8px',
            borderRadius: '4px',
            backgroundColor: 'var(--color-canvas-alt, #f8fafc)',
            color: 'var(--color-text-secondary, #475569)',
            border: '1px solid var(--color-border-base, #e2e8f0)',
          }}>
            Closed
          </span>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* 1. Metrics Panel Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 'var(--space-4)',
      }}>
        {/* Total Inquiries */}
        <Card style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
          padding: 'var(--space-5) var(--space-6)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'var(--color-brand-blue-tint, #eff6ff)',
            color: 'var(--color-brand-blue, #3b82f6)',
          }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary, #64748b)' }}>
              Total Inquiries
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-primary, #0f172a)', lineHeight: 1.2 }}>
              {metrics.total}
            </div>
          </div>
        </Card>

        {/* New Inquiries */}
        <Card style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
          padding: 'var(--space-5) var(--space-6)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'var(--color-accent-orange-tint, #fff7ed)',
            color: 'var(--color-accent-orange, #f97316)',
          }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary, #64748b)' }}>
              New Inquiries
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-primary, #0f172a)', lineHeight: 1.2 }}>
              {metrics.newCount}
            </div>
          </div>
        </Card>

        {/* Contacted */}
        <Card style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
          padding: 'var(--space-5) var(--space-6)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'var(--color-brand-blue-tint, #eff6ff)',
            color: 'var(--color-brand-blue, #2563eb)',
          }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary, #64748b)' }}>
              Contacted
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-primary, #0f172a)', lineHeight: 1.2 }}>
              {metrics.contactedCount}
            </div>
          </div>
        </Card>

        {/* Qualified */}
        <Card style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
          padding: 'var(--space-5) var(--space-6)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'var(--color-accent-teal-tint, #f0fdfa)',
            color: 'var(--color-accent-teal, #0d9488)',
          }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary, #64748b)' }}>
              Qualified
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-primary, #0f172a)', lineHeight: 1.2 }}>
              {metrics.qualifiedCount}
            </div>
          </div>
        </Card>
      </div>

      {/* 2. Search and Filter Bar */}
      <Card style={{
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
        }}>
          {/* Filter tabs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--color-canvas-alt, #f8fafc)',
            padding: '4px',
            borderRadius: '8px',
            border: '1px solid var(--color-border-base, #e2e8f0)',
            overflowX: 'auto',
            maxWidth: '100%',
          }}>
            {(['all', 'new', 'contacted', 'qualified', 'closed'] as const).map((tab) => {
              const isActive = activeFilter === tab;
              const count = tabCounts[tab];
              return (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  style={{
                    padding: 'var(--space-2) var(--space-3.5)',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: isActive ? 'var(--color-canvas-base, #ffffff)' : 'transparent',
                    color: isActive ? 'var(--color-text-primary, #0f172a)' : 'var(--color-text-secondary, #64748b)',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ textTransform: 'capitalize' }}>{tab}</span>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    backgroundColor: isActive 
                      ? 'var(--color-accent-purple-tint, #f5f3ff)' 
                      : 'var(--color-border-base, #e2e8f0)',
                    color: isActive 
                      ? 'var(--color-accent-purple, #8b5cf6)' 
                      : 'var(--color-text-secondary, #64748b)',
                    fontWeight: 700,
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div style={{
            position: 'relative',
            flex: '1 1 280px',
            maxWidth: '400px',
          }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted, #94a3b8)',
              pointerEvents: 'none',
            }} />
            <input
              type="text"
              placeholder="Search by name, email, org, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 38px',
                fontSize: '0.9rem',
                border: '1px solid var(--color-border-base, #e2e8f0)',
                borderRadius: '8px',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
                backgroundColor: 'var(--color-canvas-base, #ffffff)',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-border-focus, #3b82f6)';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border-base, #e2e8f0)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>
      </Card>

      {/* 3. Inquiries Data Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontFamily: 'var(--font-sans)',
          }}>
            <thead>
              <tr style={{
                backgroundColor: 'var(--color-canvas-alt, #f8fafc)',
                borderBottom: '1px solid var(--color-border-base, #e2e8f0)',
              }}>
                <th style={{ padding: 'var(--space-4) var(--space-6)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary, #64748b)' }}>NAME</th>
                <th style={{ padding: 'var(--space-4) var(--space-6)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary, #64748b)' }}>TYPE</th>
                <th style={{ padding: 'var(--space-4) var(--space-6)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary, #64748b)' }}>STATUS</th>
                <th style={{ padding: 'var(--space-4) var(--space-6)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary, #64748b)' }}>DATE</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: 'var(--space-12) var(--space-6)', textAlign: 'center' }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 'var(--space-3)',
                      color: 'var(--color-text-muted, #94a3b8)',
                    }}>
                      <FileText size={40} style={{ strokeWidth: 1.5 }} />
                      <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text-secondary, #475569)' }}>No Inquiries Found</div>
                      <div style={{ fontSize: '0.85rem' }}>Try clearing filters or adjusting your search search criteria</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((iq) => {
                  const isSelected = selectedInquiryId === iq.id;
                  return (
                    <tr
                      key={iq.id}
                      onClick={() => onSelectInquiry?.(iq)}
                      style={{
                        borderBottom: '1px solid var(--color-border-base, #e2e8f0)',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease',
                        backgroundColor: isSelected 
                          ? 'var(--color-accent-purple-tint, #f5f3ff)' 
                          : 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'var(--color-canvas-alt, #f8fafc)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {/* Name Col */}
                      <td style={{ padding: 'var(--space-4) var(--space-6)' }}>
                        <div style={{ fontWeight: 600, color: 'var(--color-text-primary, #0f172a)', fontSize: '0.95rem' }}>
                          {iq.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary, #64748b)', marginTop: '2px' }}>
                          {iq.email || iq.phone}
                        </div>
                      </td>

                      {/* Type Col */}
                      <td style={{ padding: 'var(--space-4) var(--space-6)' }}>
                        {getTypeBadge(iq.inquiry_type)}
                      </td>

                      {/* Status Col */}
                      <td style={{ padding: 'var(--space-4) var(--space-6)' }}>
                        {getStatusBadge(iq.status)}
                      </td>

                      {/* Date Col */}
                      <td style={{ padding: 'var(--space-4) var(--space-6)', color: 'var(--color-text-secondary, #64748b)', fontSize: '0.9rem' }}>
                        {formatDate(iq.created_at)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
