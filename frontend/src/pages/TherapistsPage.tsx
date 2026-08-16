import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserCheck, 
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Briefcase,
  Star
} from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import { motion } from 'framer-motion';

export default function TherapistsPage(): ReactNode {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <Briefcase size={22} />,
      title: 'Diverse Placements',
      desc: 'Discover clinical opportunities in schools, rehabilitation centers, hospitals, and in-home family settings.'
    },
    {
      icon: <ShieldCheck size={22} />,
      title: 'Credential Verification Badge',
      desc: 'Boost hiring manager trust. We verify your active license standing and qualifications.'
    },
    {
      icon: <Star size={22} />,
      title: 'Coordinated Matching',
      desc: 'Our placement team handles coordinate screening and scheduling, aligning clients to your specialties.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
      
      {/* HERO HEADER */}
      <section style={{ 
        borderBottom: '1px solid var(--color-border-base)',
        paddingBottom: 'var(--space-8)'
      }}>
        <Badge variant="purple" icon={<UserCheck size={12} />}>For Therapy Practitioners</Badge>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontFamily: 'var(--font-display)', 
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-3)'
        }}>
          Join TheraLink’s Verified Therapist Talent Pool
        </h1>
        <p style={{ 
          color: 'var(--color-text-secondary)', 
          maxWidth: '650px',
          fontSize: '1.05rem',
          lineHeight: '1.5',
          marginBottom: 'var(--space-6)'
        }}>
          Are you a licensed occupational therapist, physical therapist, speech-language pathologist, or behavioral specialist? Connect with TheraLink to discover rewarding placements.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <Button 
            variant="purple" 
            size="lg"
            icon={<ArrowRight size={18} />}
            iconPosition="right"
            onClick={() => navigate('/contact?type=therapist')}
          >
            Join the Talent Pool
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/vacancies')}
          >
            View Open Vacancies
          </Button>
        </div>
      </section>

      {/* WHY JOIN TALENT POOL */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ 
            fontSize: '0.75rem', 
            fontWeight: 600, 
            color: 'var(--color-accent-purple)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em' 
          }}>
            Therapist Benefits
          </span>
          <h2 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '1.75rem', 
            fontWeight: 700, 
            color: 'var(--color-text-primary)',
            textAlign: 'center'
          }}>
            Benefits of Joining Our Curated Network
          </h2>
          <div style={{ 
            width: '40px', 
            height: '4px', 
            backgroundColor: 'var(--color-accent-purple)', 
            borderRadius: 'var(--radius-full)',
            marginTop: 'var(--space-1)'
          }} />
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: 'var(--space-6)' 
        }}>
          {benefits.map((item, idx) => (
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
                  borderTop: '4px solid var(--color-accent-purple)',
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
                  backgroundColor: 'var(--color-accent-purple-tint)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-accent-purple)',
                  boxShadow: '0 2px 8px rgba(139, 92, 246, 0.08)'
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
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                    {item.desc}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CREDENTIAL VERIFICATION PARAMETERS */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4 }}
        style={{ 
          backgroundColor: 'var(--color-canvas-alt)', 
          borderRadius: 'var(--radius-lg)', 
          padding: 'var(--space-8) var(--space-6)',
          border: '1px solid var(--color-border-base)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)'
        }}
      >
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 'var(--space-1)' }}>
          Credentials Verification Checklist
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
          To maintain placement standards, we ask joining therapists to submit verification records:
        </p>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: 'var(--space-4)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            <CheckCircle size={16} color="var(--color-accent-teal)" />
            <span>Active State Therapy License</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            <CheckCircle size={16} color="var(--color-accent-teal)" />
            <span>Clinical Background Check</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            <CheckCircle size={16} color="var(--color-accent-teal)" />
            <span>Professional Liability Insurance</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            <CheckCircle size={16} color="var(--color-accent-teal)" />
            <span>Clinical References</span>
          </div>
        </div>
      </motion.section>

      {/* BOTTOM CTA BANNER */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4 }}
        style={{
          backgroundColor: 'var(--color-accent-purple-tint)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-8) var(--space-6)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-4)',
          border: '1px solid rgba(147, 51, 234, 0.12)',
          marginTop: 'var(--space-4)'
        }}
      >
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-text-primary)' }}>
          Ready to discover placement matches?
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', fontSize: '0.925rem', lineHeight: '1.5' }}>
          Connect with TheraLink and start our vetting check. We match specialists with school districts, clinical sites, and private families.
        </p>
        <Button 
          variant="purple" 
          size="md"
          icon={<ArrowRight size={16} />}
          iconPosition="right"
          onClick={() => navigate('/contact?type=therapist')}
        >
          Join the Talent Pool
        </Button>
      </motion.section>

    </div>
  );
}
