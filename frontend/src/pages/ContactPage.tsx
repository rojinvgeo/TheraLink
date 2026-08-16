import type { ReactNode, FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Info, 
  CheckCircle,
  AlertTriangle,
  Send,
  Briefcase
} from 'lucide-react';
import { Card, Button, Input, Select, Alert } from '../components/ui';
import { createInquiry } from '../api/inquiries';
import { motion } from 'framer-motion';

export default function ContactPage(): ReactNode {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type');
  const vacancyParam = searchParams.get('vacancy');

  const getVacancyDisplayName = (slug: string) => {
    switch (slug) {
      case 'speech-language-pathologist':
        return 'Speech-Language Pathologist (SLP)';
      case 'pediatric-occupational-therapist':
        return 'Pediatric Occupational Therapist';
      case 'clinical-behavioral-specialist':
        return 'Clinical Behavioral Specialist (BCBA)';
      default:
        return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  };

  // Form State
  const [inquiryType, setInquiryType] = useState('other');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [orgName, setOrgName] = useState('');
  const [location, setLocation] = useState('');
  const [preferredContact, setPreferredContact] = useState('email');
  const [therapistTypeNeeded, setTherapistTypeNeeded] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);

  // Validation & Submission UX State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [srAnnouncement, setSrAnnouncement] = useState('');

  // Handle Query Prefill
  useEffect(() => {
    if (vacancyParam) {
      setInquiryType('therapist');
    } else if (typeParam === 'organization') {
      setInquiryType('organization');
    } else if (typeParam === 'family') {
      setInquiryType('family');
    } else if (typeParam === 'therapist') {
      setInquiryType('therapist');
    } else {
      setInquiryType('other');
    }
  }, [typeParam, vacancyParam]);

  // Validation Logic
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your name.';
    }

    if (!message.trim()) {
      newErrors.message = 'Please enter your message or inquiry details.';
    }

    if (!email.trim() && !phone.trim()) {
      newErrors.contact = 'At least one contact method (Email or Phone) is required.';
    } else if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.emailFormat = 'Please enter a valid email address.';
      }
    }

    if (inquiryType === 'organization' && !orgName.trim()) {
      newErrors.orgName = 'Please enter your organization name.';
    }

    setErrors(newErrors);
    
    // Accessibility Announcement
    if (Object.keys(newErrors).length > 0) {
      setSrAnnouncement(`Form submission failed. There are ${Object.keys(newErrors).length} errors in the form.`);
    }

    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler (Real API hook)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSuccess(false);
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSrAnnouncement('Submitting your inquiry, please wait...');

    try {
      await createInquiry({
        inquiry_type: inquiryType,
        name,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        organization_name: orgName.trim() || undefined,
        location: location.trim() || undefined,
        preferred_contact_method: preferredContact,
        therapist_type_needed: therapistTypeNeeded || undefined,
        message,
        consent,
        vacancy_context: vacancyParam || undefined,
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      setSrAnnouncement('Inquiry submitted successfully. Thank you!');
      
      // Clear Form Fields
      setName('');
      setEmail('');
      setPhone('');
      setOrgName('');
      setLocation('');
      setTherapistTypeNeeded('');
      setMessage('');
      setConsent(false);
      setErrors({});
    } catch (err: any) {
      setIsSubmitting(false);
      const newErrors: Record<string, string> = {};
      if (err && typeof err === 'object') {
        if (err.contact) {
          newErrors.contact = err.contact;
        }
        if (err.detail) {
          newErrors.submit = err.detail;
        } else if (err.non_field_errors) {
          newErrors.submit = err.non_field_errors.join(' ');
        } else {
          newErrors.submit = 'Failed to submit inquiry. Please check your inputs and try again.';
        }
      } else {
        newErrors.submit = 'A network error occurred. Please check your connection and try again.';
      }
      setErrors(newErrors);
      setSrAnnouncement('Submission failed. Please correct errors and try again.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
      
      {/* HEADER */}
      <section style={{ borderBottom: '1px solid var(--color-border-base)', paddingBottom: 'var(--space-8)' }}>
        <span style={{ 
          fontSize: '0.75rem', 
          fontWeight: 600, 
          color: 'var(--color-brand-blue)', 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em',
          display: 'block',
          marginBottom: 'var(--space-1)'
        }}>
          Get In Touch
        </span>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontFamily: 'var(--font-display)', 
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-2)'
        }}>
          Start an Inquiry
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', lineHeight: '1.6', fontSize: '1.05rem' }}>
          Please select your category below so our placement coordinators can check network matches for your need.
        </p>
      </section>

      {/* TWO COLUMN CONTENT */}
      <section className="contact-columns" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: 'var(--space-8)',
        alignItems: 'start'
      }}>
        
        {/* FORM PANEL */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <Card style={{ padding: 'var(--space-8)', borderTop: '4px solid var(--color-brand-blue)', boxShadow: 'var(--shadow-md)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              
              {/* Screen Reader Announcements */}
              <div aria-live="polite" style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: '0' }}>
                {srAnnouncement}
              </div>

              {/* Success Alert */}
              {isSuccess && (
                <Alert 
                  variant="success" 
                  title="Inquiry Received" 
                  icon={<CheckCircle size={20} />}
                  description={`Thank you! Your inquiry${vacancyParam ? ` regarding the ${getVacancyDisplayName(vacancyParam)} role` : ''} has been logged. A TheraLink placement coordinator will review details and follow up shortly.`}
                />
              )}

              {/* Validation Contact Error Alert */}
              {errors.contact && (
                <Alert 
                  variant="error" 
                  title="Contact Info Required" 
                  icon={<AlertTriangle size={20} />}
                  description={errors.contact}
                />
              )}

              {/* General Submission Error Alert */}
              {errors.submit && (
                <Alert 
                  variant="error" 
                  title="Submission Failed" 
                  icon={<AlertTriangle size={20} />}
                  description={errors.submit}
                />
              )}

              {/* 1. Inquiry Type Dropdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <label htmlFor="inquiryType" style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
                  I am contacting as:
                </label>
                <Select 
                  id="inquiryType"
                  value={inquiryType}
                  onChange={(e) => {
                    setInquiryType(e.target.value);
                    setErrors({});
                  }}
                  options={[
                    { value: 'organization', label: 'Healthcare Organization / Clinic / Provider' },
                    { value: 'family', label: 'Family / Caregiver / Individual Client' },
                    { value: 'therapist', label: 'Qualified Therapist (Joining Talent Pool)' },
                    { value: 'other', label: 'Other General Inquiry' }
                  ]}
                />
              </div>

              {/* ADAPTIVE INSTRUCTIONS GUIDE PANELS */}
              {inquiryType === 'family' && (
                <div className="form-transition-container">
                  <Alert 
                    variant="warning" 
                    title="Family Privacy Guidance" 
                    icon={<Info size={18} />}
                    description="To safeguard personal data, do not write clinical diagnoses or policy ID numbers in the message. A coordinator will call you to discuss specific client care parameters."
                  />
                </div>
              )}

              {inquiryType === 'organization' && (
                <div className="form-transition-container">
                  <Alert 
                    variant="info" 
                    title="Clinic Placement Info" 
                    icon={<Info size={18} />}
                    description="Please share specific details such as hours needed, caseload specialties, and school district/site location details in the message box."
                  />
                </div>
              )}

              {inquiryType === 'therapist' && (
                <div className="form-transition-container" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {vacancyParam && (
                    <Alert 
                      variant="info" 
                      title={`Responding to Vacancy: ${getVacancyDisplayName(vacancyParam)}`}
                      icon={<Briefcase size={18} />}
                      description="Your inquiry will be flagged with this active opportunity context. A placement coordinator will review your credentials for this role."
                    />
                  )}
                  <Alert 
                    variant="info" 
                    title="Talent Pool Onboarding Notice" 
                    icon={<Info size={18} />}
                    description="Credential verification (checking licenses and reference logs) is required before we can present matching assignments."
                  />
                </div>
              )}

              {/* 2. Contact Name Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <label htmlFor="name" style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
                  Full Name:
                </label>
                <Input 
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                />
              </div>

              {/* 3. Conditional B2B Organization Name Input */}
              {inquiryType === 'organization' && (
                <div className="form-transition-container" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <label htmlFor="orgName" style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
                    Organization / Clinic Name:
                  </label>
                  <Input 
                    id="orgName"
                    placeholder="e.g. Valley Rehab Clinic"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    error={errors.orgName}
                  />
                </div>
              )}

              {/* 4. Contact Details (Email & Phone grid) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }} className="contact-grid">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <label htmlFor="email" style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Email Address:</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>* Provide either</span>
                  </label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.emailFormat || errors.contact}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <label htmlFor="phone" style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Phone Number:</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>* Provide either</span>
                  </label>
                  <Input 
                    id="phone"
                    type="tel"
                    placeholder="e.g. (555) 019-2834"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    error={errors.contact ? ' ' : undefined}
                  />
                </div>
              </div>

              {/* 5. Location and Pref Contact Method grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }} className="contact-grid">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <label htmlFor="location" style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
                    Location (City, State):
                  </label>
                  <Input 
                    id="location"
                    placeholder="e.g. Boston, MA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <label htmlFor="preferredContact" style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
                    Preferred Contact:
                  </label>
                  <Select 
                    id="preferredContact"
                    value={preferredContact}
                    onChange={(e) => setPreferredContact(e.target.value)}
                    options={[
                      { value: 'email', label: 'Email Correspondence' },
                      { value: 'phone', label: 'Phone Call / Callback' }
                    ]}
                  />
                </div>
              </div>

              {/* 6. Conditional Therapist Type Needed (Shown for Orgs/Families) */}
              {(inquiryType === 'organization' || inquiryType === 'family') && (
                <div className="form-transition-container" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <label htmlFor="therapistTypeNeeded" style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
                    Therapy Discipline Needed:
                  </label>
                  <Select 
                    id="therapistTypeNeeded"
                    value={therapistTypeNeeded}
                    onChange={(e) => setTherapistTypeNeeded(e.target.value)}
                    options={[
                      { value: '', label: 'Select discipline (Optional)' },
                      { value: 'OT', label: 'Occupational Therapy (OT)' },
                      { value: 'PT', label: 'Physical Therapy (PT)' },
                      { value: 'SLP', label: 'Speech-Language Pathology (SLP)' },
                      { value: 'behavioral', label: 'Behavioral / ABA Therapy' },
                      { value: 'other', label: 'Other Specialty' }
                    ]}
                  />
                </div>
              )}

              {/* 7. Message Box */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <label htmlFor="message" style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
                  Inquiry Details & Needs:
                </label>
                <textarea 
                  id="message"
                  placeholder={
                    inquiryType === 'organization' 
                      ? "Outlines role specialties, target start date, and caseload hours." 
                      : inquiryType === 'therapist'
                      ? "Briefly list your active state licenses and preferred placement settings."
                      : "Please summarize type of support (e.g. speech, motor skills) and scheduling goals."
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{
                    minHeight: '120px',
                    borderRadius: 'var(--radius-md)',
                    border: errors.message ? '1.5px solid var(--color-accent-orange)' : '1px solid var(--color-border-base)',
                    padding: 'var(--space-3)',
                    fontSize: '0.9rem',
                    outlineColor: 'var(--color-brand-blue)',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    lineHeight: '1.5'
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'space-between', padding: '0 2px' }}>
                  <span>* Keep diagnostic details confidential</span>
                  <span>{message.length} characters</span>
                </span>
                {errors.message && <span style={{ fontSize: '0.75rem', color: 'var(--color-accent-orange)', fontWeight: 500 }}>{errors.message}</span>}
              </div>

              {/* 8. Consent Boolean */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2.5)', marginTop: 'var(--space-1)' }}>
                <input 
                  id="consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  style={{ width: '16px', height: '16px', marginTop: '2px', cursor: 'pointer' }}
                />
                <label htmlFor="consent" style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', cursor: 'pointer', lineHeight: '1.4' }}>
                  I consent to having TheraLink process my submitted details to coordinate matches in compliance with information privacy standards.
                </label>
              </div>

              {/* 9. Submit Button */}
              <Button 
                type="submit" 
                variant="primary" 
                size="lg"
                disabled={isSubmitting}
                icon={<Send size={16} />}
                iconPosition="right"
                style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--space-2)' }}
              >
                {isSubmitting ? 'Sending Request...' : 'Submit Inquiry'}
              </Button>

            </form>
          </Card>
        </motion.div>

        {/* SIDEBAR DIRECT INFO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Card style={{ padding: 'var(--space-6)', borderTop: '4px solid var(--color-brand-blue)', boxShadow: 'var(--shadow-md)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--color-text-primary)' }}>
                TheraLink Office
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-brand-blue-tint)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-brand-blue)',
                    flexShrink: 0
                  }}>
                    <MapPin size={18} />
                  </div>
                  <div>
                    <strong style={{ color: 'var(--color-text-primary)' }}>Headquarters</strong>
                    <p style={{ marginTop: '2px', lineHeight: '1.4' }}>
                      100 Health Science Parkway<br />
                      Suite 400<br />
                      Boston, MA 02110
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-brand-blue-tint)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-brand-blue)',
                    flexShrink: 0
                  }}>
                    <Mail size={18} />
                  </div>
                  <div>
                    <strong style={{ color: 'var(--color-text-primary)' }}>Inquiry Coordinator</strong>
                    <p style={{ marginTop: '2px' }}>
                      <a href="mailto:coordinator@theralink-recruitment.com" style={{ color: 'var(--color-brand-blue)' }}>
                        coordinator@theralink-recruitment.com
                      </a>
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-brand-blue-tint)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-brand-blue)',
                    flexShrink: 0
                  }}>
                    <Phone size={18} />
                  </div>
                  <div>
                    <strong style={{ color: 'var(--color-text-primary)' }}>Staff Placement Desk</strong>
                    <p style={{ marginTop: '2px' }}>+1 (800) 555-0182</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-brand-blue-tint)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-brand-blue)',
                    flexShrink: 0
                  }}>
                    <Clock size={18} />
                  </div>
                  <div>
                    <strong style={{ color: 'var(--color-text-primary)' }}>Business Hours</strong>
                    <p style={{ marginTop: '2px' }}>Mon – Fri, 9:00 AM – 5:00 PM EST</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Card style={{ padding: 'var(--space-6)', borderLeft: '4px solid var(--color-accent-teal)', boxShadow: 'var(--shadow-md)', backgroundColor: 'var(--color-canvas-alt)' }}>
              <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 'var(--space-2)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}>Placement Timelines</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                Once you submit this form, a matching team coordinator will review your profile logs and email/phone coordinates. Inquiries are generally processed within 1-2 business days.
              </p>
            </Card>
          </motion.div>
        </div>

      </section>

      {/* Media query selectors helper */}
      <style>{`
        @media (max-width: 768px) {
          .contact-columns {
            grid-template-columns: 1fr !important;
          }
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .form-transition-container {
          animation: fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(-4px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </div>
  );
}
