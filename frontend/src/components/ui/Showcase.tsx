import { useState } from 'react';
import { 
  Button, 
  Card, 
  Input, 
  Select, 
  Badge, 
  Alert 
} from './index';
import { 
  Palette, 
  Type, 
  Layers, 
  Building2, 
  HeartHandshake,
  User,
  Send,
  Sparkles,
  Smartphone,
  Tablet,
  Monitor,
  Menu
} from 'lucide-react';

export const Showcase: React.FC = () => {
  // Tabs & interactive states
  const [activeTab, setActiveTab] = useState<'tokens' | 'components' | 'mockup'>('tokens');
  
  // Interactive Form States
  const [inquiryType, setInquiryType] = useState<string>('organization');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Responsive device view state for preview card
  const [devicePreview, setDevicePreview] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Handle mock submission
  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { name?: string; email?: string; message?: string } = {};
    if (!name.trim()) errors.name = 'Name is required';
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!message.trim()) errors.message = 'Message or description is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setSubmitSuccess(false);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    }, 1000);
  };

  const colors = [
    { name: 'Canvas Base', token: 'var(--color-canvas-base)', value: '#FFFFFF', desc: 'Default page and high-contrast card background' },
    { name: 'Canvas Alt', token: 'var(--color-canvas-alt)', value: '#F8FAFC', desc: 'Soft slate-tinted section backgrounds' },
    { name: 'Text Primary', token: 'var(--color-text-primary)', value: '#0F172A', desc: 'Core headlines and body readability' },
    { name: 'Text Secondary', token: 'var(--color-text-secondary)', value: '#475569', desc: 'Subheadings, secondary meta text' },
    { name: 'Brand Blue', token: 'var(--color-brand-blue)', value: '#3B82F6', desc: 'Core identity action, navigation highlights, primary cues' },
    { name: 'Accent Teal', token: 'var(--color-accent-teal)', value: '#0D9488', desc: 'Healing/Clinical status, organizations hiring pathway' },
    { name: 'Accent Orange', token: 'var(--color-accent-orange)', value: '#F97316', desc: 'Warm humanity, caregivers and family search pathway' },
    { name: 'Accent Purple', token: 'var(--color-accent-purple)', value: '#8B5CF6', desc: 'Modern expertise, therapist credentialing and pool' },
  ];

  const shadows = [
    { name: 'Shadow Small', token: 'var(--shadow-sm)', value: '0 1px 3px 0 rgba(0,0,0,0.05)', desc: 'Used for tiny badge actions or hover inputs' },
    { name: 'Shadow Medium', token: 'var(--shadow-md)', value: '0 4px 6px -1px rgba(0,0,0,0.05)', desc: 'Standard card elevation resting state' },
    { name: 'Shadow Large', token: 'var(--shadow-lg)', value: '0 10px 15px -3px rgba(0,0,0,0.05)', desc: 'Dropdowns, active modals, and high focus elements' },
    { name: 'Shadow XL (Hover)', token: 'var(--shadow-xl)', value: '0 20px 25px -5px rgba(0,0,0,0.07)', desc: 'Expanded soft shadow when card raises on hover' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-canvas-alt)', color: 'var(--color-text-primary)' }}>
      {/* 1. Header Banner */}
      <header style={{ 
        backgroundColor: 'var(--color-canvas-base)', 
        borderBottom: '1px solid var(--color-border-base)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '1rem var(--space-8)'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ 
              backgroundColor: 'var(--color-brand-blue-tint)', 
              color: 'var(--color-brand-blue)',
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '1.25rem'
            }}>TL</div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                TheraLink <span style={{ fontWeight: 400, color: 'var(--color-text-secondary)', fontSize: '1rem' }}>Design System</span>
              </h1>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>V1.0.0 • Responsive Vanilla CSS & React UI Components</p>
            </div>
          </div>
          
          {/* Main Tabs */}
          <div style={{ display: 'flex', backgroundColor: 'var(--color-canvas-alt)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-base)' }}>
            <button 
              onClick={() => setActiveTab('tokens')}
              style={{
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: activeTab === 'tokens' ? 'var(--color-canvas-base)' : 'transparent',
                color: activeTab === 'tokens' ? 'var(--color-brand-blue)' : 'var(--color-text-secondary)',
                boxShadow: activeTab === 'tokens' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Visual Tokens
            </button>
            <button 
              onClick={() => setActiveTab('components')}
              style={{
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: activeTab === 'components' ? 'var(--color-canvas-base)' : 'transparent',
                color: activeTab === 'components' ? 'var(--color-brand-blue)' : 'var(--color-text-secondary)',
                boxShadow: activeTab === 'components' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              UI Components
            </button>
            <button 
              onClick={() => setActiveTab('mockup')}
              style={{
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: activeTab === 'mockup' ? 'var(--color-canvas-base)' : 'transparent',
                color: activeTab === 'mockup' ? 'var(--color-brand-blue)' : 'var(--color-text-secondary)',
                boxShadow: activeTab === 'mockup' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Interactive Form Demo
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main content wrapper */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-8) var(--space-4)' }}>
        
        {/* ==============================================
            TAB 1: DESIGN TOKENS SHOWCASE
            ============================================== */}
        {activeTab === 'tokens' && (
          <div>
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 'var(--space-2)' }}>Visual Design Tokens</h2>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: '800px' }}>
                Design tokens are the visual atoms of the TheraLink identity. They establish our core colors, typography, shapes, and elevation depths using native CSS custom properties.
              </p>
            </div>

            {/* Colors Swatches Grid */}
            <section style={{ marginBottom: 'var(--space-12)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border-base)', paddingBottom: 'var(--space-2)' }}>
                <Palette size={20} color="var(--color-brand-blue)" />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Core & Accent Palettes</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
                {colors.map((color) => (
                  <Card key={color.name} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <div style={{ 
                      height: '100px', 
                      backgroundColor: color.token, 
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border-base)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'flex-end',
                      padding: '8px'
                    }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 'bold', 
                        backgroundColor: 'rgba(255,255,255,0.85)',
                        color: 'var(--color-text-primary)',
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-sm)',
                        fontFamily: 'monospace'
                      }}>{color.value}</span>
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '4px' }}>{color.name}</h4>
                      <code style={{ fontSize: '0.75rem', color: 'var(--color-brand-blue)', display: 'block', marginBottom: '8px' }}>{color.token}</code>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}>{color.desc}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Typography Ramp */}
            <section style={{ marginBottom: 'var(--space-12)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border-base)', paddingBottom: 'var(--space-2)' }}>
                <Type size={20} color="var(--color-brand-blue)" />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Typography Scale</h3>
              </div>
              <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                <div>
                  <Badge variant="blue">Font Family: Outfit (Display Headings)</Badge>
                  <div style={{ marginTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Heading Large (2.25rem • Outfit Bold)</span>
                      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 700 }}>Connecting therapist talent to need</h1>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Heading Medium (1.75rem • Outfit Semibold)</span>
                      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600 }}>Specialized B2B and B2C recruiting</h2>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Heading Small (1.25rem • Outfit Semibold)</span>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600 }}>Verified therapist talent pool</h3>
                    </div>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-base)' }} />

                <div>
                  <Badge variant="teal">Font Family: Inter (Body & Labels)</Badge>
                  <div style={{ marginTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Body Regular (1rem • Inter Regular)</span>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', color: 'var(--color-text-primary)' }}>
                        TheraLink is a specialized therapy recruitment and talent solutions company connecting qualified therapists with healthcare organizations and families. We operate at the intersection of healthcare staffing and trusted support.
                      </p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Body Small (0.875rem • Inter Regular)</span>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                        *Consent Note: Share only the basic details of your staffing needs or situation. TheraLink does not provide clinical care or diagnostics directly on this website.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* Corner Radius & Elevation Depth */}
            <section style={{ marginBottom: 'var(--space-12)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border-base)', paddingBottom: 'var(--space-2)' }}>
                <Layers size={20} color="var(--color-brand-blue)" />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Shapes & Soft Shadows</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
                {shadows.map((sh, idx) => {
                  const radii = ['var(--radius-sm)', 'var(--radius-md)', 'var(--radius-lg)', 'var(--radius-full)'];
                  const rName = ['Small (4px)', 'Medium (8px)', 'Large (12px)', 'Full (9999px)'];
                  return (
                    <div 
                      key={sh.name}
                      style={{
                        backgroundColor: 'var(--color-canvas-base)',
                        border: '1px solid var(--color-border-base)',
                        borderRadius: radii[idx],
                        boxShadow: sh.token,
                        padding: 'var(--space-6)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-2)'
                      }}
                    >
                      <h4 style={{ fontWeight: 'bold' }}>{sh.name}</h4>
                      <code style={{ fontSize: '0.75rem', color: 'var(--color-accent-teal)' }}>{sh.token}</code>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{sh.desc}</p>
                      <div style={{ 
                        marginTop: 'auto', 
                        padding: '4px 8px', 
                        backgroundColor: 'var(--color-canvas-alt)', 
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        color: 'var(--color-text-secondary)',
                        textAlign: 'center'
                      }}>
                        Corner radius: <strong>{rName[idx]}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* ==============================================
            TAB 2: COMPONENTS PLAYGROUND
            ============================================== */}
        {activeTab === 'components' && (
          <div>
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 'var(--space-2)' }}>Reusable UI Components</h2>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: '800px' }}>
                All UI components are modular, styled with standard CSS, responsive, and follow accessibility guidelines. They are ready to be integrated into TheraLink views.
              </p>
            </div>

            {/* Buttons Section */}
            <section style={{ marginBottom: 'var(--space-12)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border-base)', paddingBottom: 'var(--space-2)' }}>Buttons</h3>
              <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                <div>
                  <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>Action Variants</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                    <Button variant="primary">Primary (Blue)</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="text">Text Link</Button>
                    <Button variant="teal">Clinic / B2B (Teal)</Button>
                    <Button variant="orange">Caregiver / Family (Orange)</Button>
                    <Button variant="purple">Therapist Pool (Purple)</Button>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>Sizing Scale</h4>
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                    <Button size="sm" variant="primary">Small Action (sm)</Button>
                    <Button size="md" variant="primary">Medium Default (md)</Button>
                    <Button size="lg" variant="primary">Large Hero Action (lg)</Button>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>States & Icons</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                    <Button variant="primary" disabled>Disabled State</Button>
                    <Button variant="primary" icon={<Sparkles size={16} />} iconPosition="left">Left Icon</Button>
                    <Button variant="teal" icon={<Sparkles size={16} />} iconPosition="right">Right Icon</Button>
                  </div>
                </div>
              </Card>
            </section>

            {/* Cards Section */}
            <section style={{ marginBottom: 'var(--space-12)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border-base)', paddingBottom: 'var(--space-2)' }}>Cards</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
                <Card bordered={true}>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', marginBottom: 'var(--space-2)' }}>Base Card Container</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                    Standard card using default properties: white background, thin border outline, and soft elevation shadows.
                  </p>
                  <Button variant="outline" size="sm">Learn More</Button>
                </Card>

                <Card hoverable={true}>
                  <Badge variant="teal" style={{ marginBottom: 'var(--space-2)' }}>Interactive</Badge>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', marginBottom: 'var(--space-2)' }}>Hover Raise Animation</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                    Card shifts vertically by 4px on hover and deepens the shadow, creating tactile modern depth.
                  </p>
                  <Button variant="teal" size="sm" icon={<Sparkles size={14} />}>Explore Action</Button>
                </Card>

                <Card flat={true} style={{ backgroundColor: 'var(--color-canvas-alt)' }}>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', marginBottom: 'var(--space-2)' }}>Flat Card Variant</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                    Card with border details but no shadow depth. Useful for sections overlays on off-white content grids.
                  </p>
                  <Button variant="text" size="sm">Read Guidelines</Button>
                </Card>
              </div>
            </section>

            {/* Form Controls Section */}
            <section style={{ marginBottom: 'var(--space-12)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border-base)', paddingBottom: 'var(--space-2)' }}>Form Controls</h3>
              <Card>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
                  <div>
                    <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>Input Text Fields</h4>
                    <Input 
                      label="Contact Full Name" 
                      placeholder="Jane Doe" 
                    />
                    <Input 
                      label="Contact Email Address" 
                      type="email" 
                      placeholder="jane@example.com" 
                      error="A valid email is required to respond to you." 
                    />
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>Select Menus & Textareas</h4>
                    <Select 
                      label="Your Inquiry Category" 
                      options={[
                        { value: 'org', label: 'Healthcare Organization Hiring' },
                        { value: 'family', label: 'Family/Individual Therapist Support' },
                        { value: 'therapist', label: 'Therapist joining Talent Pool' },
                      ]}
                    />
                    <Input 
                      label="Briefly describe your staffing need" 
                      textarea={true} 
                      placeholder="Please let us know which specialties you require..." 
                    />
                  </div>
                </div>
              </Card>
            </section>

            {/* Badges & Alerts Section */}
            <section style={{ marginBottom: 'var(--space-12)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border-base)', paddingBottom: 'var(--space-2)' }}>Status Tags & System Alerts</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
                {/* Badges playground */}
                <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem' }}>Accented Pills & Badges</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    <Badge variant="blue">General Status</Badge>
                    <Badge variant="teal" icon={<Building2 size={12} />}>B2B Hiring</Badge>
                    <Badge variant="orange" icon={<HeartHandshake size={12} />}>For Families</Badge>
                    <Badge variant="purple" icon={<User size={12} />}>Therapists</Badge>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    Used for tagging categories, credentials, specialties, or process stages.
                  </p>
                </Card>

                {/* Alerts playground */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <Alert 
                    variant="info" 
                    title="Privacy Guidance" 
                    description="Please share only basic contact info. Do not send health diagnosis details." 
                  />
                  <Alert 
                    variant="success" 
                    title="Inquiry Received" 
                    description="Thank you! We will review and reply within 1 business day." 
                  />
                  <Alert 
                    variant="warning" 
                    title="Pending Verification" 
                    description="Therapist credential verification is required before matching." 
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ==============================================
            TAB 3: INTERACTIVE DEMO (MOCK INQUIRY FORM)
            ============================================== */}
        {activeTab === 'mockup' && (
          <div>
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 'var(--space-2)' }}>Interactive Contact Form Preview</h2>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: '800px' }}>
                This is a mockup of the TheraLink Contact page, showing how components, focus rings, validation warnings, and success feedback respond interactively.
              </p>
            </div>

            {/* Device frame preview wrapper */}
            <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)', justifyContent: 'center' }}>
              <button 
                onClick={() => setDevicePreview('mobile')}
                style={{
                  border: '1px solid var(--color-border-base)',
                  backgroundColor: devicePreview === 'mobile' ? 'var(--color-brand-blue-tint)' : 'var(--color-canvas-base)',
                  color: devicePreview === 'mobile' ? 'var(--color-brand-blue)' : 'var(--color-text-secondary)',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Smartphone size={16} /> Mobile View
              </button>
              <button 
                onClick={() => setDevicePreview('tablet')}
                style={{
                  border: '1px solid var(--color-border-base)',
                  backgroundColor: devicePreview === 'tablet' ? 'var(--color-brand-blue-tint)' : 'var(--color-canvas-base)',
                  color: devicePreview === 'tablet' ? 'var(--color-brand-blue)' : 'var(--color-text-secondary)',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Tablet size={16} /> Tablet View
              </button>
              <button 
                onClick={() => setDevicePreview('desktop')}
                style={{
                  border: '1px solid var(--color-border-base)',
                  backgroundColor: devicePreview === 'desktop' ? 'var(--color-brand-blue-tint)' : 'var(--color-canvas-base)',
                  color: devicePreview === 'desktop' ? 'var(--color-brand-blue)' : 'var(--color-text-secondary)',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Monitor size={16} /> Desktop Full
              </button>
            </div>

            {/* Container mapping to simulated widths */}
            <div style={{
              margin: '0 auto',
              width: devicePreview === 'mobile' ? '375px' : devicePreview === 'tablet' ? '768px' : '100%',
              maxWidth: '100%',
              border: devicePreview !== 'desktop' ? '8px solid #1e293b' : 'none',
              borderRadius: devicePreview !== 'desktop' ? '24px' : '0',
              overflow: 'hidden',
              backgroundColor: 'var(--color-canvas-base)',
              boxShadow: devicePreview !== 'desktop' ? 'var(--shadow-xl)' : 'none',
              transition: 'width 0.3s ease, border 0.3s ease'
            }}>
              
              {/* Mock App Header */}
              <div style={{
                backgroundColor: 'var(--color-canvas-base)',
                borderBottom: '1px solid var(--color-border-base)',
                padding: 'var(--space-4)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                  Thera<span style={{ color: 'var(--color-brand-blue)' }}>Link</span>
                </span>
                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                  {devicePreview === 'desktop' ? (
                    <>
                      <a href="#services" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Services</a>
                      <a href="#about" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>About</a>
                      <Button size="sm" variant="outline">Contact</Button>
                    </>
                  ) : (
                    <Menu size={20} color="var(--color-text-secondary)" />
                  )}
                </div>
              </div>

              {/* Page Hero Content */}
              <div style={{
                padding: devicePreview === 'mobile' ? 'var(--space-6) var(--space-4)' : 'var(--space-12) var(--space-8)',
                textAlign: 'center',
                backgroundColor: 'var(--color-canvas-alt)',
                borderBottom: '1px solid var(--color-border-base)'
              }}>
                <h3 style={{ 
                  fontFamily: 'var(--font-display)', 
                  fontSize: devicePreview === 'mobile' ? '1.5rem' : '2.25rem',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-3)'
                }}>
                  Get in touch with TheraLink
                </h3>
                <p style={{ 
                  fontSize: '0.95rem', 
                  color: 'var(--color-text-secondary)', 
                  maxWidth: '550px',
                  margin: '0 auto' 
                }}>
                  Connect with therapists, secure hiring support, or express interest in joining our verified talent network.
                </p>
              </div>

              {/* Inquiry form layout */}
              <div style={{ 
                padding: devicePreview === 'mobile' ? 'var(--space-6) var(--space-4)' : 'var(--space-12) var(--space-8)',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                
                {submitSuccess && (
                  <Alert 
                    variant="success" 
                    title="Inquiry Sent Successfully" 
                    description="Thank you! We've received your request and our matching team will reach out within 1 business day." 
                    style={{ marginBottom: 'var(--space-6)' }}
                  />
                )}

                <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  
                  {/* Select type triggers button style changes dynamically */}
                  <Select 
                    label="I am contacting as:" 
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    options={[
                      { value: 'organization', label: 'Healthcare Organization / Clinic' },
                      { value: 'family', label: 'Family / Individual Client' },
                      { value: 'therapist', label: 'Qualified Therapist' },
                      { value: 'general', label: 'Other / General inquiry' }
                    ]}
                  />

                  {/* Adaptive info box helper based on selected type */}
                  {inquiryType === 'organization' && (
                    <Alert 
                      variant="info" 
                      icon={<Building2 size={18} />}
                      title="B2B Staffing Support"
                      description="We support clinics, schools, and hospitals with verified staffing options. Tell us about your specialization needs below."
                    />
                  )}
                  {inquiryType === 'family' && (
                    <Alert 
                      variant="warning"
                      icon={<HeartHandshake size={18} />}
                      title="Approachable Care Matching"
                      description="We connect families to specialized therapists. Please share only basic details. Keep sensitive diagnostic information for the private call."
                    />
                  )}
                  {inquiryType === 'therapist' && (
                    <Alert 
                      variant="success"
                      title="Verified Talent Network"
                      description="Join a network of credentialed specialists. We will follow up with registration and verification steps."
                    />
                  )}

                  <Input 
                    label="Full Name" 
                    placeholder="Enter your name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={formErrors.name}
                  />

                  <Input 
                    label="Email Address" 
                    type="email"
                    placeholder="you@domain.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={formErrors.email}
                  />

                  <Input 
                    label="What support or talent needs can we assist you with?" 
                    textarea={true}
                    placeholder={
                      inquiryType === 'organization' ? "Describe the specialized therapy roles, hours, or credentials you're sourcing..." :
                      inquiryType === 'family' ? "What therapy focus or therapist style would best help your child or family member..." :
                      "Tell us about your profession, license type, and the placements you are looking for..."
                    }
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    error={formErrors.message}
                  />

                  {/* Adaptive CTA button color matches selected path */}
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    variant={
                      inquiryType === 'organization' ? 'teal' :
                      inquiryType === 'family' ? 'orange' :
                      inquiryType === 'therapist' ? 'purple' : 'primary'
                    }
                    icon={<Send size={16} />}
                    iconPosition="right"
                    style={{ marginTop: 'var(--space-2)', width: '100%', justifyContent: 'center' }}
                  >
                    {isSubmitting ? 'Sending Request...' : 'Submit Inquiry'}
                  </Button>
                </form>
              </div>

              {/* Mock App Footer */}
              <div style={{
                backgroundColor: 'var(--color-canvas-alt)',
                borderTop: '1px solid var(--color-border-base)',
                padding: 'var(--space-6) var(--space-4)',
                textAlign: 'center',
                fontSize: '0.8rem',
                color: 'var(--color-text-secondary)'
              }}>
                <p style={{ fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>TheraLink recruitment and talent solutions.</p>
                <p style={{ maxWidth: '400px', margin: '0 auto 12px', fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
                  Disclaimer: TheraLink is a recruiter and placement partner, connecting qualified specialists. We do not provide clinical therapy directly.
                </p>
                <p>© 2026 TheraLink Inc. All rights reserved.</p>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
};
