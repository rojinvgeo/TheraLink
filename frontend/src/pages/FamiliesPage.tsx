import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HeartHandshake, 
  Info, 
  ArrowRight,
  ShieldCheck,
  Search,
  MessageSquare
} from 'lucide-react';
import { Card, Button, Badge, Alert } from '../components/ui';
import { motion } from 'framer-motion';

export default function FamiliesPage(): ReactNode {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
      
      {/* HERO HEADER */}
      <section style={{ 
        borderBottom: '1px solid var(--color-border-base)',
        paddingBottom: 'var(--space-8)'
      }}>
        <Badge variant="orange" icon={<HeartHandshake size={12} />}>For Families & Caregivers</Badge>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontFamily: 'var(--font-display)', 
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-3)'
        }}>
          Therapist Search Support for Your Family
        </h1>
        <p style={{ 
          color: 'var(--color-text-secondary)', 
          maxWidth: '650px',
          fontSize: '1.05rem',
          lineHeight: '1.6',
          marginBottom: 'var(--space-6)'
        }}>
          Finding the right therapist for a child or family member can feel overwhelming. TheraLink helps you connect with qualified, credential-verified therapy specialists who fit your family’s routine.
        </p>
        <Button 
          variant="orange" 
          size="lg"
          icon={<ArrowRight size={18} />}
          iconPosition="right"
          onClick={() => navigate('/contact?type=family')}
        >
          Request Therapist Support
        </Button>
      </section>

      {/* SERVICE BOUNDARY AND PRIVACY ALERT BOXES */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4 }}
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}
      >
        <Alert 
          variant="warning" 
          title="Supporting Your Family's Placement Alignment"
          icon={<Info size={20} />}
          description={
            <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
              TheraLink acts strictly as a recruitment matching partner and placement coordinator. We do not provide clinical therapy directly, manage treatment pathways, or deliver medical diagnoses. All medical choices and practitioner supervision are handled independently between families and their matched certified specialists.
            </p>
          }
        />

        <Alert 
          variant="info" 
          title="Protecting Your Family's Sensitive Information First"
          icon={<ShieldCheck size={20} />}
          description={
            <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
              To safeguard your family's personal privacy, please do not include medical history logs, diagnostic records, evaluations, or healthcare policy details in your initial contact message. A simple summary of the type of support needed is sufficient for our coordinators to begin checking therapist alignments.
            </p>
          }
        />
      </motion.section>

      {/* HOW WE CAN HELP PATHWAY */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ 
            fontSize: '0.75rem', 
            fontWeight: 600, 
            color: 'var(--color-accent-orange)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em' 
          }}>
            Our Pathway
          </span>
          <h2 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '1.75rem', 
            fontWeight: 700, 
            color: 'var(--color-text-primary)',
            textAlign: 'center'
          }}>
            Our Approach to Family Placements
          </h2>
          <div style={{ 
            width: '40px', 
            height: '4px', 
            backgroundColor: 'var(--color-accent-orange)', 
            borderRadius: 'var(--radius-full)',
            marginTop: 'var(--space-1)'
          }} />
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: 'var(--space-6)' 
        }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: 0.05 }}
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
                borderTop: '4px solid var(--color-accent-orange)',
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
                backgroundColor: 'var(--color-accent-orange-tint)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-accent-orange)',
                boxShadow: '0 2px 8px rgba(249, 115, 22, 0.08)'
              }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 style={{ 
                  fontWeight: 700, 
                  fontSize: '1.15rem', 
                  marginBottom: 'var(--space-2)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-display)'
                }}>
                  Verified Credentials
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                  We check license parameters and background files on every practitioner in our network, ensuring you connect only with qualified experts.
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: 0.15 }}
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
                borderTop: '4px solid var(--color-accent-orange)',
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
                backgroundColor: 'var(--color-accent-orange-tint)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-accent-orange)',
                boxShadow: '0 2px 8px rgba(249, 115, 22, 0.08)'
              }}>
                <Search size={24} />
              </div>
              <div>
                <h4 style={{ 
                  fontWeight: 700, 
                  fontSize: '1.15rem', 
                  marginBottom: 'var(--space-2)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-display)'
                }}>
                  Specialty Filtering
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                  We look for therapists trained in speech therapy, physical therapy, occupational support, or behavioral plans to match your exact goals.
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: 0.25 }}
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
                borderTop: '4px solid var(--color-accent-orange)',
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
                backgroundColor: 'var(--color-accent-orange-tint)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-accent-orange)',
                boxShadow: '0 2px 8px rgba(249, 115, 22, 0.08)'
              }}>
                <MessageSquare size={24} />
              </div>
              <div>
                <h4 style={{ 
                  fontWeight: 700, 
                  fontSize: '1.15rem', 
                  marginBottom: 'var(--space-2)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-display)'
                }}>
                  Coordinated Walkthrough
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                  Our matching team guides you through the introduction pipeline, resolving questions so your onboarding is smooth.
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4 }}
        style={{
          backgroundColor: 'var(--color-accent-orange-tint)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-8) var(--space-6)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-4)',
          border: '1px solid rgba(249, 115, 22, 0.12)',
          marginTop: 'var(--space-4)'
        }}
      >
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-text-primary)' }}>
          Looking for trusted therapist support?
        </h3>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px', fontSize: '0.925rem', lineHeight: '1.5' }}>
          Get in touch with our matching coordinators. We will check our network of verified specialists to support your family.
        </p>
        <Button 
          variant="orange" 
          size="md"
          icon={<ArrowRight size={16} />}
          iconPosition="right"
          onClick={() => navigate('/contact?type=family')}
        >
          Request Therapist Support
        </Button>
      </motion.section>

    </div>
  );
}
