import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight,
  Info,
  Mail,
  Clock
} from 'lucide-react';
import { Card, Button, Badge, Alert } from '../components/ui';
import { motion } from 'framer-motion';

export default function AboutPage(): ReactNode {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
      
      {/* HEADER SECTION */}
      <section style={{ 
        borderBottom: '1px solid var(--color-border-base)',
        paddingBottom: 'var(--space-8)'
      }}>
        <Badge variant="blue" style={{ marginBottom: 'var(--space-2)' }}>About Us</Badge>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontFamily: 'var(--font-display)', 
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-3)'
        }}>
          Connecting Clinical Talent with Need
        </h1>
        <p style={{ 
          color: 'var(--color-text-secondary)', 
          maxWidth: '650px',
          fontSize: '1.05rem',
          lineHeight: '1.5'
        }}>
          TheraLink operates as a specialized therapy recruitment and matching coordinator, establishing trust through strict credential reviews.
        </p>
      </section>

      {/* TWO COLUMN DETAILS SECTION */}
      <section className="about-columns" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: 'var(--space-8)' 
      }}>
        
        {/* Left Column: Story & Specialized Focus */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <span style={{ 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              color: 'var(--color-brand-blue)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em' 
            }}>
              Who We Are
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Company Overview & Focus
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              TheraLink was established to address the placement friction in the therapy sector. Generalist recruiting agencies lack the domain depth required to screen specialists. We focus exclusively on connecting occupational therapists, physical therapists, speech-language pathologists, and behavioral specialists with clinics and families.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <span style={{ 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              color: 'var(--color-accent-teal)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em' 
            }}>
              Our Focus
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Why Specialized Therapy Recruitment?
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              Therapy disciplines require precise qualification checks: state licensure tracking, pediatric/adult specialty certifications, and facility match coordination. Job boards and general recruiting firms often fail to check these criteria. TheraLink bridges the gap by conducting pre-placement credential checks.
            </p>
          </div>
        </motion.div>

        {/* Right Column: Pillars of Trust */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <span style={{ 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              color: 'var(--color-accent-purple)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em' 
            }}>
              Our Principles
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)' }}>
              Our Trust Philosophy
            </h2>
          </div>
          
          <motion.div whileHover={{ x: 4, transition: { duration: 0.2 } }}>
            <Card style={{ padding: 'var(--space-5)', display: 'flex', gap: 'var(--space-4)', borderLeft: '4px solid var(--color-brand-blue)', height: '100%' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-brand-blue-tint)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-brand-blue)',
                flexShrink: 0
              }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '4px', color: 'var(--color-text-primary)' }}>Strict Credential Checks</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
                  We screen state licensure parameters and clinical registration listings before introducing therapists to candidates.
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div whileHover={{ x: 4, transition: { duration: 0.2 } }}>
            <Card style={{ padding: 'var(--space-5)', display: 'flex', gap: 'var(--space-4)', borderLeft: '4px solid var(--color-accent-teal)', height: '100%' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-accent-teal-tint)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-accent-teal)',
                flexShrink: 0
              }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '4px', color: 'var(--color-text-primary)' }}>Clear Placements Matching</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
                  We check client requirements against therapist experiences, coordinating fit for developmental settings.
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div whileHover={{ x: 4, transition: { duration: 0.2 } }}>
            <Card style={{ padding: 'var(--space-5)', display: 'flex', gap: 'var(--space-4)', borderLeft: '4px solid var(--color-accent-purple)', height: '100%' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-accent-purple-tint)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-accent-purple)',
                flexShrink: 0
              }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '4px', color: 'var(--color-text-primary)' }}>Humble, Direct Communication</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
                  We prioritize clear boundaries and direct, responsive follow-up to keep private details secure.
                </p>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* SERVICE BOUNDARY DEDICATED ALERTS */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4 }}
      >
        <Alert 
          variant="warning" 
          title="Clinical Service Boundary Disclaimer"
          icon={<Info size={20} />}
          description={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              <p>
                <strong>TheraLink operates strictly as a specialized recruitment, placement coordination, and talent matchmaking partner.</strong>
              </p>
              <p>
                We are not a healthcare provider, do not deliver clinical care directly, and do not make medical diagnoses, prescribe treatment plans, or manage direct therapist services on this platform. All clinical care decisions, therapist supervision parameters, and medical details are managed independently between clients, families, and their matched credentialed practitioners.
              </p>
            </div>
          }
        />
      </motion.section>

      {/* COMPANY CONTACT POINTERS */}
      <section style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 'var(--space-4)',
        borderTop: '1px solid var(--color-border-base)',
        paddingTop: 'var(--space-8)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Company Contact Details</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Get in touch with our operations team for placement inquiries.</p>
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: 'var(--space-4)',
          marginTop: 'var(--space-2)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            padding: 'var(--space-4)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-canvas-alt)',
            border: '1px solid var(--color-border-base)'
          }}>
            <Mail size={20} style={{ color: 'var(--color-brand-blue)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inquiries Support</div>
              <a href="mailto:coordinator@theralink-recruitment.com" style={{ fontSize: '0.925rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                coordinator@theralink-recruitment.com
              </a>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            padding: 'var(--space-4)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-canvas-alt)',
            border: '1px solid var(--color-border-base)'
          }}>
            <Clock size={20} style={{ color: 'var(--color-accent-teal)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Operational Hours</div>
              <div style={{ fontSize: '0.925rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                Monday – Friday, 9:00 AM – 5:00 PM EST
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4 }}
        style={{
          backgroundColor: 'var(--color-brand-blue-tint)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-8) var(--space-6)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-4)',
          border: '1px solid rgba(59, 130, 246, 0.12)',
          marginTop: 'var(--space-4)'
        }}
      >
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-text-primary)', fontWeight: 700 }}>
          Have recruitment or placement goals?
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', fontSize: '0.925rem', lineHeight: '1.5' }}>
          Get in touch with a TheraLink matching coordinator to begin discussing therapist solutions today.
        </p>
        <Button 
          variant="primary" 
          size="md"
          icon={<ArrowRight size={16} />}
          iconPosition="right"
          onClick={() => navigate('/contact')}
        >
          Contact TheraLink
        </Button>
      </motion.section>

      {/* Responsive media layout styles helper */}
      <style>{`
        @media (max-width: 800px) {
          .about-columns {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
