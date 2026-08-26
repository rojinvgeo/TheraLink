import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  CreditCard, 
  Briefcase, 
  Building2, 
  CheckCircle,
  User,
  ClipboardList,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Card, Button } from '../components/ui';
import { motion } from 'framer-motion';

export default function RecruitmentPartnerPlanPage(): ReactNode {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/partner/register');
  };

  const benefits = [
    { text: '3 Years Validity', icon: <Clock size={16} /> },
    { text: 'One-time Payment', icon: <CreditCard size={16} /> },
    { text: 'Access to Opportunities', icon: <Briefcase size={16} /> },
    { text: 'Partner Dashboard', icon: <Building2 size={16} /> },
    { text: 'Dedicated Support', icon: <CheckCircle size={16} /> },
  ];

  const steps = [
    { title: 'Create Account', icon: <User size={24} /> },
    { title: 'Complete Details', icon: <ClipboardList size={24} /> },
    { title: 'Make Payment', icon: <CreditCard size={24} /> },
    { title: 'Start Working', icon: <CheckCircle2 size={24} /> }
  ];

  return (
    <div className="flex flex-col gap-16 md:gap-24 relative overflow-hidden text-left max-w-5xl mx-auto px-4 py-8">
      
      {/* Background ambient radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[300px] bg-[radial-gradient(ellipse_at_top,_var(--color-brand-blue-tint)_0%,rgba(255,255,255,0)_70%)] pointer-events-none -z-10" />

      {/* 1. HERO & PRICING SPLIT SECTION */}
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 py-8">
        
        {/* Left Column: Heading and Benefits */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col gap-6 text-left"
        >
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 leading-tight">
            Become a<br />Recruitment Partner
          </h1>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-lg">
            Join TheraLink’s partner network and expand your reach. Our partners enjoy exclusive benefits and long-term opportunities.
          </p>

          <div className="flex flex-col gap-4 mt-2">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-full bg-teal-50 text-accent-teal flex items-center justify-center flex-shrink-0 shadow-xs" style={{ backgroundColor: 'var(--color-accent-teal-tint)', color: 'var(--color-accent-teal)' }}>
                  {benefit.icon}
                </div>
                <span className="font-semibold text-slate-700 text-sm md:text-base">{benefit.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Pricing Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-96 flex-shrink-0 flex justify-center"
        >
          <Card className="w-full bg-white border border-slate-100 rounded-2xl p-10 shadow-md hover:shadow-lg transition-all duration-300 text-center flex flex-col items-center gap-6">
            <div>
              <p className="text-slate-500 font-medium text-xs uppercase tracking-wider">Recruitment Partner Plan</p>
              <h2 className="text-5xl font-black text-slate-900 font-display mt-3 mb-1">₹2,500</h2>
              <p className="text-accent-teal font-bold text-sm tracking-wide mt-2" style={{ color: 'var(--color-accent-teal)' }}>3 Years Validity</p>
            </div>
            
            <hr className="w-full border-slate-100" />

            <Button 
              variant="teal" 
              onClick={handleGetStarted}
              className="w-full py-3.5 font-bold shadow-md hover:shadow-lg transition-all duration-300 rounded-xl"
              style={{ 
                justifyContent: 'center'
              }}
            >
              Get Started Now
            </Button>
          </Card>
        </motion.div>
      </div>

      {/* 2. HOW IT WORKS SECTION */}
      <motion.section 
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col gap-12 text-center pt-8 border-t border-slate-100"
      >
        <div>
          <h2 className="font-display text-3xl font-extrabold text-slate-900">How It Works</h2>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8 lg:gap-4 max-w-4xl mx-auto w-full">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-2 flex-1 w-full">
              
              {/* Step circle */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-16 h-16 rounded-full bg-teal-50 text-accent-teal flex items-center justify-center shadow-xs border border-teal-100/50" style={{ backgroundColor: 'var(--color-accent-teal-tint)', color: 'var(--color-accent-teal)' }}>
                  {step.icon}
                </div>
                <h4 className="font-bold text-slate-800 text-sm md:text-base mt-4 whitespace-nowrap">{step.title}</h4>
              </div>

              {/* Arrow spacer between steps */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block text-slate-400 mt-5 self-start pt-1 px-2">
                  <ChevronRight size={20} />
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.section>

    </div>
  );
}
