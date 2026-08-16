import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  HeartHandshake, 
  UserCheck, 
  Sliders, 
  Check, 
  ArrowRight
} from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import { motion } from 'framer-motion';

export default function ServicesPage(): ReactNode {
  const navigate = useNavigate();

  const offerings = [
    {
      title: 'B2B Hiring Solutions',
      description: 'Sourcing, screening, and staffing solutions designed specifically for healthcare organizations, schools, and private clinics.',
      icon: <Building2 size={22} />,
      colorClass: 'var(--color-accent-teal)',
      bgColorClass: 'var(--color-accent-teal-tint)',
      buttonText: 'View Clinic Pathway',
      buttonVariant: 'teal' as const,
      route: '/for-organizations',
      bullets: [
        'Curated pipelines for occupational, physical, and speech therapists',
        'Reduced administrative sourcing friction and screening overhead',
        'Flexible placement matches (temporary, contract, or direct hire)'
      ]
    },
    {
      title: 'B2C Family Therapist Search',
      description: 'Approachabler matching services connecting families and caregivers with trustworthy, qualified therapist specialists.',
      icon: <HeartHandshake size={22} />,
      colorClass: 'var(--color-accent-orange)',
      bgColorClass: 'var(--color-accent-orange-tint)',
      buttonText: 'View Family Pathway',
      buttonVariant: 'orange' as const,
      route: '/for-families',
      bullets: [
        'Dedicated care coordination support for pediatric or adult needs',
        'Transparent verification guidelines to build trust',
        'Basic, low-friction initial inquiries to protect details privacy'
      ]
    },
    {
      title: 'Verified Therapist Talent Pool',
      description: 'Our centralized network of credentialed therapy practitioners open for placements and contract opportunities.',
      icon: <UserCheck size={22} />,
      colorClass: 'var(--color-accent-purple)',
      bgColorClass: 'var(--color-accent-purple-tint)',
      buttonText: 'View Therapist Pathway',
      buttonVariant: 'purple' as const,
      route: '/for-therapists',
      bullets: [
        'Thorough license checking and clinical credentials screening',
        'Specialty matching (OT, PT, SLP, and behavioral fields)',
        'Active pipeline monitoring to optimize practitioner placements'
      ]
    },
    {
      title: 'Trusted Recruitment Coordination',
      description: 'Assisted recruitment support from TheraLink specialists handling onboarding logistics and credential fit reviews.',
      icon: <Sliders size={22} />,
      colorClass: 'var(--color-brand-blue)',
      bgColorClass: 'var(--color-brand-blue-tint)',
      buttonText: 'Start Triage Inquiry',
      buttonVariant: 'primary' as const,
      route: '/contact',
      bullets: [
        'Dedicated recruitment managers tracking credential alignments',
        'Assisted screening, interviews support, and fit coordinating',
        'Secure lead logs to prevent information loss during placement'
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
      
      {/* HEADER SECTION */}
      <section style={{ 
        borderBottom: '1px solid var(--color-border-base)',
        paddingBottom: 'var(--space-8)'
      }}>
        <Badge variant="blue" style={{ marginBottom: 'var(--space-2)' }}>Services Portfolio</Badge>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontFamily: 'var(--font-display)', 
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-3)'
        }}>
          Recruitment & Placement Solutions
        </h1>
        <p style={{ 
          color: 'var(--color-text-secondary)', 
          maxWidth: '650px',
          fontSize: '1.05rem',
          lineHeight: '1.5'
        }}>
          TheraLink operates as a dedicated talent matchmaker. We evaluate qualifications and structure therapist matches to reduce hiring friction for organizations and families.
        </p>
      </section>

      {/* CORE OFFERINGS GRID */}
      <section className="services-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
        gap: 'var(--space-8)' 
      }}>
        {offerings.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <Card hoverable style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 'var(--space-6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <div style={{ 
                  color: item.colorClass, 
                  backgroundColor: item.bgColorClass,
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {item.icon}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>
                  {item.title}
                </h3>
              </div>
              
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: '1.5', marginBottom: 'var(--space-4)' }}>
                {item.description}
              </p>

              <ul style={{ 
                listStyleType: 'none', 
                paddingLeft: 0, 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-6)',
                flex: 1
              }}>
                {item.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: 'var(--space-2)',
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: '1.4'
                  }}>
                    <Check size={16} color="var(--color-accent-teal)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={item.buttonVariant} 
                onClick={() => navigate(item.route)}
                style={{ justifyContent: 'center' }}
              >
                {item.buttonText}
              </Button>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* AUDIENCE SELECTOR BOTTOM BANNER */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4 }}
        style={{
          backgroundColor: 'var(--color-canvas-alt)',
          border: '1px solid var(--color-border-base)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-8) var(--space-6)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--space-6)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxWidth: '500px' }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--color-text-primary)' }}>
            Not sure where to begin?
          </h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
            We have dedicated workflows configured to handle clinical registrations, institutional recruitment needs, and family search requests.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Button variant="outline" size="sm" onClick={() => navigate('/for-organizations')}>Organizations</Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/for-families')}>Families</Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/for-therapists')}>Therapists</Button>
          <Button variant="primary" size="sm" icon={<ArrowRight size={14} />} iconPosition="right" onClick={() => navigate('/contact')}>
            Start Inquiry
          </Button>
        </div>
      </motion.section>

      {/* Media query styling for smaller viewports */}
      <style>{`
        @media (max-width: 900px) {
          .services-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
