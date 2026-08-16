import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  UserSearch,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import { motion } from 'framer-motion';

export default function OrganizationsPage(): ReactNode {
  const navigate = useNavigate();

  const challenges = [
    {
      icon: <UserSearch size={24} />,
      title: 'Sourcing Qualified Specialists',
      desc: 'Finding therapists with specialized pediatric or adult certifications is time-consuming.'
    },
    {
      icon: <ShieldAlert size={24} />,
      title: 'Screening Friction',
      desc: 'Checking credentials, references, and licensing details requires deep clinical understanding.'
    },
    {
      icon: <Clock size={24} />,
      title: 'Onboarding Lag',
      desc: 'Delays in placements lead to service disruptions and patient care bottlenecks.'
    }
  ];

  const benefits = [
    {
      icon: <ShieldCheck size={20} />,
      title: 'Verified Talent Pool',
      desc: 'Every therapist is pre-screened for active state licenses and background checks.'
    },
    {
      icon: <Zap size={20} />,
      title: 'Reduced Placement Timelines',
      desc: 'Our curated networks allow coordinators to identify matching candidates within days.'
    },
    {
      icon: <Users size={20} />,
      title: 'Flexible Staffing Terms',
      desc: 'Support temporary contracts, contract-to-hire arrangements, or direct staffing.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
      
      {/* HERO HEADER */}
      <section style={{ 
        borderBottom: '1px solid var(--color-border-base)',
        paddingBottom: 'var(--space-8)'
      }}>
        <Badge variant="teal" icon={<Building2 size={12} />}>For Healthcare & Educational Providers</Badge>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontFamily: 'var(--font-display)', 
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-3)'
        }}>
          Therapist Staffing & Recruitment Support
        </h1>
        <p style={{ 
          color: 'var(--color-text-secondary)', 
          maxWidth: '650px',
          fontSize: '1.05rem',
          lineHeight: '1.5',
          marginBottom: 'var(--space-6)'
        }}>
          TheraLink helps clinics, schools, and care systems secure credentialed occupational, physical, speech, and behavioral therapists. We manage screening so you can manage care.
        </p>
        <Button 
          variant="teal" 
          size="lg"
          icon={<ArrowRight size={18} />}
          iconPosition="right"
          onClick={() => navigate('/contact?type=organization')}
        >
          Request Hiring Support
        </Button>
      </section>

      {/* HIRING CHALLENGES SECTOR */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <span style={{ 
            fontSize: '0.75rem', 
            fontWeight: 600, 
            color: 'var(--color-accent-teal)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em' 
          }}>
            The Challenge
          </span>
          <h2 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '1.75rem', 
            fontWeight: 700, 
            color: 'var(--color-text-primary)' 
          }}>
            Overcoming Staffing Friction
          </h2>
          <div style={{ 
            width: '40px', 
            height: '4px', 
            backgroundColor: 'var(--color-accent-teal)', 
            borderRadius: 'var(--radius-full)',
            marginTop: 'var(--space-1)'
          }} />
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: 'var(--space-6)' 
        }}>
          {challenges.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ 
                y: -6, 
                transition: { duration: 0.2, ease: 'easeOut' }
              }}
              style={{ height: '100%' }}
            >
              <Card 
                style={{ 
                  padding: 'var(--space-6)', 
                  height: '100%',
                  borderTop: '4px solid var(--color-accent-teal)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-4)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-accent-teal-tint)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-accent-teal)',
                  boxShadow: '0 2px 8px rgba(13, 148, 136, 0.08)'
                }}>
                  {item.icon}
                </div>
                <div>
                  <h4 style={{ 
                    fontWeight: 700, 
                    fontSize: '1.15rem', 
                    marginBottom: 'var(--space-2)', 
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-display)'
                  }}>
                    {item.title}
                  </h4>
                  <p style={{ 
                    fontSize: '0.9rem', 
                    color: 'var(--color-text-secondary)', 
                    lineHeight: '1.6' 
                  }}>
                    {item.desc}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* THERALINK STAFFING SUPPORT SOLUTION */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        style={{ 
          backgroundColor: 'var(--color-canvas-alt)', 
          borderRadius: 'var(--radius-lg)', 
          padding: 'var(--space-8) var(--space-6)',
          border: '1px solid var(--color-border-base)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-6)'
        }}
      >
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>
          How TheraLink Coordinates Placements
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: 'var(--space-6)' 
        }}>
          {benefits.map((benefit, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <div style={{ color: 'var(--color-accent-teal)', marginTop: '2px', flexShrink: 0 }}>
                {benefit.icon}
              </div>
              <div>
                <h4 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>
                  {benefit.title}
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}>
                  {benefit.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* BOTTOM CTA BANNER */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4 }}
        style={{
          backgroundColor: 'var(--color-accent-teal-tint)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-8) var(--space-6)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-4)',
          border: '1px solid rgba(13, 148, 136, 0.12)',
          marginTop: 'var(--space-4)'
        }}
      >
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-text-primary)' }}>
          Need specialized therapy talent?
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', fontSize: '0.925rem', lineHeight: '1.5' }}>
          Connect with a placement manager. We will review your staffing goals and match credentialed specialists.
        </p>
        <Button 
          variant="teal" 
          size="md"
          icon={<ArrowRight size={16} />}
          iconPosition="right"
          onClick={() => navigate('/contact?type=organization')}
        >
          Request Hiring Support
        </Button>
      </motion.section>

    </div>
  );
}
