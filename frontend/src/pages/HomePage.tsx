import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Building2, 
  HeartHandshake, 
  UserCheck, 
  ShieldCheck, 
  ChevronRight,
  ClipboardList,
  Search,
  CheckCircle2,
  FileCheck,
  Award,
  Sparkles
} from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import { motion } from 'framer-motion';
import { getVacancies } from '../api/vacancies';
import { VacanciesPreview } from '../features/vacancies/VacanciesPreview';
import type { Vacancy } from '../features/vacancies/vacancyTypes';

export default function HomePage(): ReactNode {
  const navigate = useNavigate();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);

  useEffect(() => {
    getVacancies().then(setVacancies).catch(() => {});
  }, []);

  return (
    <div className="flex flex-col gap-16 md:gap-24 relative overflow-hidden">
      
      {/* Background ambient radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--color-brand-blue-tint)_0%,rgba(255,255,255,0)_70%)] pointer-events-none -z-10" />

      {/* 1. HERO SECTION */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-12 md:py-20 flex flex-col items-center gap-6 w-full max-w-4xl self-center"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%', margin: '0 auto' }}
      >
        <Badge variant="blue" className="bg-blue-50/80 border border-blue-100/50 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-xs text-brand-blue">
          <Sparkles size={12} className="animate-pulse" />
          Therapist Placement Solutions
        </Badge>
        <h1 
          className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-slate-900 leading-tight tracking-tight text-center"
          style={{ textAlign: 'center', width: '100%' }}
        >
          TheraLink connects qualified therapists with healthcare organizations and families.
        </h1>
        <p 
          className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed mt-2 text-center"
          style={{ textAlign: 'center', width: '100%' }}
        >
          We operate at the intersection of specialized staffing, credential verification, and trusted placement support.
        </p>
        <div className="flex gap-4 flex-wrap justify-center mt-4">
          <Button 
            variant="primary" 
            size="lg" 
            icon={<ArrowRight size={18} />} 
            iconPosition="right"
            onClick={() => navigate('/contact')}
            className="shadow-md hover:shadow-lg transition-all duration-300"
          >
            Contact TheraLink
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/services')}
            className="hover:bg-slate-50 transition-all duration-300"
          >
            Explore Services
          </Button>
        </div>
      </motion.section>

      {/* 2. AUDIENCE PATHS CHOOSER */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col gap-8"
      >
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold mb-2 text-slate-900">
            Choose Your Pathway
          </h2>
          <p className="text-slate-600">
            Identify your goal to access relevant support resources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Organizations */}
          <Card hoverable className="audience-card-teal group flex flex-col h-full bg-white border border-slate-100 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-accent-teal/40 hover:shadow-teal-500/5" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="text-accent-teal bg-accent-teal-tint w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-accent-teal group-hover:text-white">
              <Building2 size={24} />
            </div>
            <h3 className="font-display text-xl font-bold mb-3 text-slate-900">
              Healthcare Organizations
            </h3>
            <p className="text-sm text-slate-600 mb-8 flex-1 leading-relaxed">
              Hire qualified therapy specialists with reduced sourcing and screening friction. We support clinics, schools, and hospitals.
            </p>
            <Button 
              variant="teal" 
              onClick={() => navigate('/for-organizations')}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Hire Therapists
            </Button>
          </Card>

          {/* Families */}
          <Card hoverable className="audience-card-orange group flex flex-col h-full bg-white border border-slate-100 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-accent-orange/40 hover:shadow-orange-500/5" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="text-accent-orange bg-accent-orange-tint w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-accent-orange group-hover:text-white">
              <HeartHandshake size={24} />
            </div>
            <h3 className="font-display text-xl font-bold mb-3 text-slate-900">
              Families & Caregivers
            </h3>
            <p className="text-sm text-slate-600 mb-8 flex-1 leading-relaxed">
              Find trustworthy, verified therapist support tailored to your family member’s needs in an approachable, supportive manner.
            </p>
            <Button 
              variant="orange" 
              onClick={() => navigate('/for-families')}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Find Therapist Support
            </Button>
          </Card>

          {/* Therapists */}
          <Card hoverable className="audience-card-purple group flex flex-col h-full bg-white border border-slate-100 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-accent-purple/40 hover:shadow-purple-500/5" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="text-accent-purple bg-accent-purple-tint w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-accent-purple group-hover:text-white">
              <UserCheck size={24} />
            </div>
            <h3 className="font-display text-xl font-bold mb-3 text-slate-900">
              Therapists & Specialists
            </h3>
            <p className="text-sm text-slate-600 mb-8 flex-1 leading-relaxed">
              Join our verified talent pool to access specialized placement opportunities and manage your assignments.
            </p>
            <Button 
              variant="purple" 
              onClick={() => navigate('/for-therapists')}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Join the Talent Pool
            </Button>
          </Card>
        </div>
      </motion.section>

      {/* 2.5 VACANCIES PREVIEW (conditional) */}
      {vacancies.length > 0 && (
        <VacanciesPreview vacancies={vacancies} />
      )}

      {/* 3. SERVICES SUMMARY */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-canvas-alt border border-border-base rounded-2xl p-6 md:p-8"
      >
        <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
          <div>
            <Badge variant="blue" className="mb-2">What We Offer</Badge>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900">Core Solutions</h2>
          </div>
          <Button variant="text" onClick={() => navigate('/services')} icon={<ChevronRight size={16} />} iconPosition="right">
            View all service details
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          
          {/* B2B Hiring */}
          <div 
            onClick={() => navigate('/for-organizations')}
            className="group cursor-pointer relative z-0 hover:z-10 bg-white border border-slate-100 rounded-2xl p-6 hover:border-brand-blue/40 hover:shadow-lg transition-all duration-300 transform-gpu hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="text-brand-blue bg-blue-50/70 w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 group-hover:bg-brand-blue group-hover:text-white">
                <Building2 size={18} />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit mb-2 inline-block">
                Healthcare Orgs
              </span>
              <h4 className="text-base font-bold mb-2 text-slate-900 leading-snug">
                B2B Hiring
              </h4>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-4">
                Dedicated recruitment pipelines to staff clinics, schools, and hospitals with verified experts.
              </p>
            </div>
            <div className="text-xs font-semibold text-brand-blue flex items-center gap-1 pt-4 border-t border-slate-100/80 mt-auto">
              <span>Learn more</span>
              <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>

          {/* B2C Match */}
          <div 
            onClick={() => navigate('/for-families')}
            className="group cursor-pointer relative z-0 hover:z-10 bg-white border border-slate-100 rounded-2xl p-6 hover:border-accent-teal/40 hover:shadow-lg transition-all duration-300 transform-gpu hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="text-accent-teal bg-teal-50/70 w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 group-hover:bg-accent-teal group-hover:text-white">
                <HeartHandshake size={18} />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded w-fit mb-2 inline-block">
                Families & Caregivers
              </span>
              <h4 className="text-base font-bold mb-2 text-slate-900 leading-snug">
                B2C Match
              </h4>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-4">
                Individualized searches matching caregivers with therapists for developmental or ongoing support.
              </p>
            </div>
            <div className="text-xs font-semibold text-accent-teal flex items-center gap-1 pt-4 border-t border-slate-100/80 mt-auto">
              <span>Learn more</span>
              <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>

          {/* Talent Network */}
          <div 
            onClick={() => navigate('/for-therapists')}
            className="group cursor-pointer relative z-0 hover:z-10 bg-white border border-slate-100 rounded-2xl p-6 hover:border-accent-purple/40 hover:shadow-lg transition-all duration-300 transform-gpu hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="text-accent-purple bg-accent-purple-tint w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 group-hover:bg-accent-purple group-hover:text-white">
                <UserCheck size={18} />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded w-fit mb-2 inline-block">
                Therapist Specialists
              </span>
              <h4 className="text-base font-bold mb-2 text-slate-900 leading-snug">
                Talent Network
              </h4>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-4">
                A curated network of practitioners whose qualifications have been reviewed by our staff.
              </p>
            </div>
            <div className="text-xs font-semibold text-accent-purple flex items-center gap-1 pt-4 border-t border-slate-100/80 mt-auto">
              <span>Learn more</span>
              <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>

          {/* Process Support */}
          <div 
            onClick={() => navigate('/services')}
            className="group cursor-pointer relative z-0 hover:z-10 bg-white border border-slate-100 rounded-2xl p-6 hover:border-accent-orange/40 hover:shadow-lg transition-all duration-300 transform-gpu hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="text-accent-orange bg-orange-50/70 w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 group-hover:bg-accent-orange group-hover:text-white">
                <ClipboardList size={18} />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded w-fit mb-2 inline-block">
                Placement Operations
              </span>
              <h4 className="text-base font-bold mb-2 text-slate-900 leading-snug">
                Process Support
              </h4>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-4">
                End-to-end placement coordination, interviews, and onboarding logistics support.
              </p>
            </div>
            <div className="text-xs font-semibold text-accent-orange flex items-center gap-1 pt-4 border-t border-slate-100/80 mt-auto">
              <span>Learn more</span>
              <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>

        </div>
      </motion.section>

      {/* 4. TRUST STATEMENT & SPECIALIZATION */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      >
        <div className="flex flex-col gap-4">
          <Badge variant="teal" icon={<ShieldCheck size={14} />} className="w-fit bg-teal-50 text-accent-teal border border-teal-100/50 rounded-full px-3 py-1 text-xs font-semibold">Confidence Built on Standards</Badge>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
            Why TheraLink is trusted by partners and families
          </h2>
          <p className="text-slate-600 leading-relaxed text-base">
            General recruitment platforms lack domain specialization. TheraLink focuses strictly on therapy fields—occupational, physical, speech, and behavioral—ensuring credentials are verified and matches align with developmental goals.
          </p>
          <p className="text-xs text-slate-500 border-l-2 border-slate-300 pl-4 py-1 italic leading-relaxed bg-slate-50/50 rounded-r-lg">
            Disclaimer: TheraLink acts as a placement connection coordinator. We do not provide clinical therapy directly, make diagnoses, or manage treatment on this website.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="flex gap-4 p-5 hover:border-brand-blue/30 hover:shadow-xs transition-all duration-300 bg-white border border-slate-100 rounded-xl">
            <div className="text-brand-blue bg-blue-50/70 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileCheck size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Credential Verification Focus</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                We check licenses, active certifications, and clinical backgrounds.
              </p>
            </div>
          </Card>
          <Card className="flex gap-4 p-5 hover:border-accent-teal/30 hover:shadow-xs transition-all duration-300 bg-white border border-slate-100 rounded-xl">
            <div className="text-accent-teal bg-teal-50/70 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Award size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Domain Specialization</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our team understands therapy roles and clinical terms.
              </p>
            </div>
          </Card>
          <Card className="flex gap-4 p-5 hover:border-accent-orange/30 hover:shadow-xs transition-all duration-300 bg-white border border-slate-100 rounded-xl">
            <div className="text-accent-orange bg-orange-50/70 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
              <HeartHandshake size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Careful Matching</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                We coordinate requirements manually to ensure cultural and clinical fit.
              </p>
            </div>
          </Card>
        </div>
      </motion.section>

      {/* 5. PROCESS TIMELINE */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col gap-8"
      >
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold mb-2 text-slate-900">
            Simple, Supportive Process
          </h2>
          <p className="text-slate-600">
            Three simple steps to coordinate your placement fit.
          </p>
        </div>

        <div className="process-grid grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="process-step relative text-center flex flex-col items-center gap-3 bg-white border border-slate-50 rounded-2xl p-6 hover:shadow-md transition-shadow duration-300">
            <span className="absolute top-4 right-4 text-3xl font-display font-black text-slate-100/70 select-none">01</span>
            <div className="bg-brand-blue-tint text-brand-blue w-14 h-14 rounded-full flex items-center justify-center shadow-inner">
              <ClipboardList size={24} />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Share Your Needs</h4>
            <p className="text-sm text-slate-600 leading-relaxed max-w-[240px]">
              Submit a brief inquiry outlining your hiring goals or family search criteria.
            </p>
          </div>

          <div className="process-step relative text-center flex flex-col items-center gap-3 bg-white border border-slate-50 rounded-2xl p-6 hover:shadow-md transition-shadow duration-300">
            <span className="absolute top-4 right-4 text-3xl font-display font-black text-slate-100/70 select-none">02</span>
            <div className="bg-accent-teal-tint text-accent-teal w-14 h-14 rounded-full flex items-center justify-center shadow-inner">
              <Search size={24} />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Coordinate Fit</h4>
            <p className="text-sm text-slate-600 leading-relaxed max-w-[240px]">
              Our matching experts review credentials and coordinate options based on fit.
            </p>
          </div>

          <div className="process-step process-step-last relative text-center flex flex-col items-center gap-3 bg-white border border-slate-50 rounded-2xl p-6 hover:shadow-md transition-shadow duration-300">
            <span className="absolute top-4 right-4 text-3xl font-display font-black text-slate-100/70 select-none">03</span>
            <div className="bg-accent-purple-tint text-accent-purple w-14 h-14 rounded-full flex items-center justify-center shadow-inner">
              <CheckCircle2 size={24} />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Secure Placement</h4>
            <p className="text-sm text-slate-600 leading-relaxed max-w-[240px]">
              Finalize agreements and complete onboarding coordinates with clinical talent.
            </p>
          </div>
        </div>
      </motion.section>

      {/* 6. BOTTOM CTA BANNER */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden bg-gradient-to-br from-blue-50/70 to-indigo-50/40 border border-blue-100/50 rounded-3xl p-10 md:p-16 text-center w-full max-w-4xl self-center flex flex-col items-center gap-6 shadow-xs"
      >
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />

        <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
          Ready to find the right matching fit?
        </h3>
        <p className="text-slate-600 max-w-lg leading-relaxed text-sm md:text-base">
          Contact us today to coordinate therapist staffing support for your clinic, school, or caregiver family.
        </p>
        <Button 
          variant="primary" 
          size="lg"
          onClick={() => navigate('/contact')}
          className="mt-2 shadow-md hover:shadow-lg transition-all duration-300"
        >
          Start an Inquiry
        </Button>
      </motion.section>

      {/* Dotted lines timeline alignment rules */}
      <style>{`
        @media (min-width: 769px) {
          .process-step::after {
            content: '';
            position: absolute;
            top: 40px;
            right: -25%;
            width: 40%;
            height: 1px;
            border-top: 2px dotted var(--color-border-base);
          }
          .process-step-last::after {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
