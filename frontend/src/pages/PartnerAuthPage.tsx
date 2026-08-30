import type { ReactNode, FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  User, 
  Building2, 
  CheckCircle2, 
  AlertTriangle,
  ArrowLeft,
  Phone,
  Globe
} from 'lucide-react';
import { Card, Button, Input, Select, Alert } from '../components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { registerPartner } from '../api/partners';

interface PartnerAuthPageProps {
  initialMode?: 'login' | 'register';
}

export default function PartnerAuthPage({ initialMode = 'register' }: PartnerAuthPageProps): ReactNode {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [step, setStep] = useState<1 | 2>(1);
  
  // Step 1 Form values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2 Form values
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [country, setCountry] = useState('India');

  // Status values
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync mode with props if initialMode changes
  useEffect(() => {
    setMode(initialMode);
    setStep(1);
    setErrors({});
  }, [initialMode]);

  const countryOptions = [
    { value: 'India', label: 'India' },
    { value: 'United States', label: 'United States' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Australia', label: 'Australia' }
  ];

  const handleNextStep = () => {
    setErrors({});
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStep(2);
  };

  const handleBackStep = () => {
    setErrors({});
    setStep(1);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (mode === 'login') {
      const newErrors: Record<string, string> = {};
      if (!email.trim()) {
        newErrors.email = 'Email address is required.';
      }
      if (!password) {
        newErrors.password = 'Password is required.';
      }
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // Simulate login
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }, 1200);
    } else {
      // Step 2 Final Submission
      const newErrors: Record<string, string> = {};
      if (!companyName.trim()) {
        newErrors.companyName = 'Company/Agency name is required.';
      }
      if (!country) {
        newErrors.country = 'Country selection is required.';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setIsSubmitting(true);
      registerPartner({
        name,
        email,
        phone_number: phoneNumber,
        password,
        confirm_password: confirmPassword,
        company_name: companyName,
        website,
        country
      })
      .then(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      })
      .catch((err: any) => {
        setIsSubmitting(false);
        const mappedErrors: Record<string, string> = {};
        if (err && typeof err === 'object') {
          Object.entries(err).forEach(([field, messages]) => {
            let msg = '';
            if (Array.isArray(messages)) {
              msg = messages[0];
            } else if (typeof messages === 'string') {
              msg = messages;
            } else {
              msg = JSON.stringify(messages);
            }

            // Map backend snake_case key to frontend camelCase state key
            if (field === 'phone_number') {
              mappedErrors.phoneNumber = msg;
            } else if (field === 'company_name') {
              mappedErrors.companyName = msg;
            } else if (field === 'confirm_password') {
              mappedErrors.confirmPassword = msg;
            } else {
              mappedErrors[field] = msg;
            }
          });
        } else {
          mappedErrors.nonFieldErrors = 'Registration failed. Please try again.';
        }

        // If there are errors for step 1 fields, return to step 1
        const step1Keys = ['name', 'email', 'phoneNumber', 'password', 'confirmPassword'];
        const hasStep1Errors = Object.keys(mappedErrors).some(k => step1Keys.includes(k));
        if (hasStep1Errors) {
          setStep(1);
        }
        setErrors(mappedErrors);
      });
    }
  };

  // Reusable input styling for Teal focus borders and glow ring
  const inputTealFocusClass = "focus:border-accent-teal focus:ring-3 focus:ring-accent-teal/15";

  return (
    <div className={`flex flex-col items-center justify-center relative text-left transition-all duration-300 ${
      mode === 'register' && step === 1 && !isSuccess ? 'min-h-[500px] py-4 md:py-6' : 'min-h-[600px] py-12'
    }`}>
      
      {/* Background ambient radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--color-brand-blue-tint)_0%,rgba(255,255,255,0)_70%)] pointer-events-none -z-10" />

      {/* Back to Plans navigation */}
      <button 
        onClick={() => navigate('/recruitment-partner-plan')}
        className="absolute top-4 left-0 flex items-center gap-2 text-sm text-slate-500 hover:text-accent-teal transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back to Plans
      </button>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`w-full transition-all duration-300 ${
          mode === 'register' && step === 1 && !isSuccess ? 'mt-2 md:mt-4' : 'mt-6'
        } ${
          mode === 'register' && !isSuccess ? 'max-w-md md:max-w-2xl' : 'max-w-md'
        }`}
      >
        <Card className={`bg-white border border-slate-100 rounded-2xl shadow-xl transition-all duration-300 ${
          mode === 'register' && step === 1 && !isSuccess ? 'p-6' : 'p-8'
        }`}>
          
          {/* Logo & Header */}
          <div className={`text-center ${
            mode === 'register' && step === 1 && !isSuccess ? 'mb-3 md:mb-4' : 'mb-6'
          }`}>
            <span className="font-display font-black text-2xl">
              Thera<span className="text-brand-blue">Link</span>
            </span>
          </div>

          {/* Stepper progress bar line for registration */}
          {mode === 'register' && !isSuccess && (
            <div className={`relative flex justify-between items-center max-w-[200px] mx-auto ${
              step === 1 ? 'mb-4 md:mb-5' : 'mb-8'
            }`}>
              {/* Progress Line Background */}
              <div className="absolute left-0 right-0 top-1/2 -translate-x-0 -translate-y-1/2 h-0.5 bg-slate-100" style={{ transform: 'translateY(-50%)' }} />
              {/* Progress Line Fill */}
              <div 
                className="absolute left-0 top-1/2 -translate-x-0 -translate-y-1/2 h-0.5 bg-accent-teal transition-all duration-300" 
                style={{ 
                  width: step === 2 ? '100%' : '0%',
                  backgroundColor: 'var(--color-accent-teal)',
                  transform: 'translateY(-50%)'
                }} 
              />
              {/* Step 1 Circle */}
              <div 
                className="relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white transition-all duration-300 shadow-xs"
                style={{ backgroundColor: 'var(--color-accent-teal)' }}
              >
                1
              </div>
              {/* Step 2 Circle */}
              <div 
                className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 shadow-xs ${
                  step === 2 ? 'text-white' : 'bg-slate-200 text-slate-500'
                }`}
                style={{ 
                  backgroundColor: step === 2 ? 'var(--color-accent-teal)' : ''
                }}
              >
                2
              </div>
            </div>
          )}

          {/* Form Actions switch tabs */}
          {mode === 'login' && !isSuccess && (
            <div className="flex border-b border-slate-100 mb-6">
              <button
                onClick={() => { setMode('register'); setStep(1); setErrors({}); }}
                className="flex-1 pb-3 text-sm font-semibold border-b-2 border-transparent text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              >
                Create Account
              </button>
              <button
                onClick={() => { setMode('login'); setErrors({}); }}
                className="flex-1 pb-3 text-sm font-semibold border-b-2 border-accent-teal text-accent-teal transition-all cursor-pointer font-display"
                style={{ borderColor: 'var(--color-accent-teal)', color: 'var(--color-accent-teal)' }}
              >
                Sign In
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-6 text-center gap-4"
              >
                <div className="text-success bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center shadow-inner">
                  <CheckCircle2 size={36} className="text-success" />
                </div>
                <div>
                  <h4 className="font-display text-xl font-bold text-slate-900">
                    {mode === 'register' ? 'Registration Complete!' : 'Welcome Back!'}
                  </h4>
                  <p className="text-sm text-slate-600 mt-1">
                    Simulating dashboard redirect to home page...
                  </p>
                </div>
              </motion.div>
            ) : mode === 'login' ? (
              /* LOGIN VIEW */
              <motion.form 
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-4 text-left"
                key="login-form"
              >
                {Object.keys(errors).length > 0 && (
                  <Alert 
                    variant="error"
                    title="Please fix errors below"
                    icon={<AlertTriangle size={16} />}
                    description="Please review and complete the fields marked in red."
                  />
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                  <Input 
                    type="email"
                    placeholder="e.g. john@org.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                    icon={<Mail size={16} />}
                    className={inputTealFocusClass}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
                  <Input 
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    icon={<Lock size={16} />}
                    className={inputTealFocusClass}
                  />
                </div>

                <div className="flex justify-between items-center py-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="accent-accent-teal rounded cursor-pointer"
                    />
                    <span className="text-xs text-slate-500">Remember me</span>
                  </label>
                  <a href="#forgot" className="text-xs text-accent-teal hover:underline" onClick={(e) => e.preventDefault()} style={{ color: 'var(--color-accent-teal)' }}>
                    Forgot Password?
                  </a>
                </div>

                <Button
                  variant="teal"
                  type="submit"
                  disabled={isSubmitting}
                  className="py-3 shadow-md w-full justify-center mt-2 flex items-center gap-2"
                >
                  {isSubmitting ? 'Processing...' : 'Sign In'}
                </Button>

                <div className="text-center mt-4">
                  <span className="text-xs text-slate-500">Don't have an account? </span>
                  <button 
                    type="button"
                    onClick={() => { setMode('register'); setStep(1); setErrors({}); }}
                    className="text-xs text-accent-teal font-semibold hover:underline cursor-pointer"
                    style={{ color: 'var(--color-accent-teal)' }}
                  >
                    Register
                  </button>
                </div>
              </motion.form>
            ) : step === 1 ? (
              /* STEP 1: CREATE ACCOUNT */
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-2.5 md:gap-3 text-center"
                key="step-1"
              >
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 font-display">Create Your Account</h3>
                  <p className="text-sm text-slate-500 mt-1">Join as a Recruitment Partner</p>
                </div>

                {errors.nonFieldErrors && (
                  <Alert 
                    variant="error"
                    title="Registration failed"
                    icon={<AlertTriangle size={16} />}
                    description={errors.nonFieldErrors}
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 mt-2 md:mt-3 text-left">
                  <div className="md:col-span-2">
                    <Input 
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      error={errors.name}
                      icon={<User size={16} />}
                      className={inputTealFocusClass}
                    />
                  </div>

                  <div className="md:col-span-1">
                    <Input 
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={errors.email}
                      icon={<Mail size={16} />}
                      className={inputTealFocusClass}
                    />
                  </div>

                  <div className="md:col-span-1">
                    <Input 
                      type="tel"
                      placeholder="Phone Number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      error={errors.phoneNumber}
                      icon={<Phone size={16} />}
                      className={inputTealFocusClass}
                    />
                  </div>

                  <div className="md:col-span-1">
                    <Input 
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={errors.password}
                      icon={<Lock size={16} />}
                      className={inputTealFocusClass}
                    />
                  </div>

                  <div className="md:col-span-1">
                    <Input 
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      error={errors.confirmPassword}
                      icon={<Lock size={16} />}
                      className={inputTealFocusClass}
                    />
                  </div>
                </div>

                <div className="text-center mt-1 md:mt-2">
                  <span className="text-xs text-slate-500">Already have an account? </span>
                  <button 
                    type="button"
                    onClick={() => { setMode('login'); setErrors({}); }}
                    className="text-xs text-accent-teal font-semibold hover:underline cursor-pointer"
                    style={{ color: 'var(--color-accent-teal)' }}
                  >
                    Login
                  </button>
                </div>

                <Button
                  variant="teal"
                  type="button"
                  onClick={handleNextStep}
                  className="py-2.5 md:py-3 shadow-md w-full justify-center mt-1 md:mt-2 rounded-xl"
                >
                  Next
                </Button>

                <p className="text-[10px] text-slate-400 text-center leading-normal px-2 mt-1 md:mt-1.5">
                  By creating an account, you agree to our{' '}
                  <a href="#terms" className="text-accent-teal hover:underline" onClick={(e) => e.preventDefault()} style={{ color: 'var(--color-accent-teal)' }}>Terms & Conditions</a>{' '}
                  and{' '}
                  <a href="#privacy" className="text-accent-teal hover:underline" onClick={(e) => e.preventDefault()} style={{ color: 'var(--color-accent-teal)' }}>Privacy Policy</a>.
                </p>
              </motion.div>
            ) : (
              /* STEP 2: COMPANY DETAILS */
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4 text-center"
                key="step-2"
              >
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 font-display">Tell us about your company</h3>
                  <p className="text-sm text-slate-500 mt-1">This information helps us know you better</p>
                </div>

                {errors.nonFieldErrors && (
                  <Alert 
                    variant="error"
                    title="Registration failed"
                    icon={<AlertTriangle size={16} />}
                    description={errors.nonFieldErrors}
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 mt-4 text-left">
                  <div className="md:col-span-1">
                    <Input 
                      type="text"
                      placeholder="Company / Agency Name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      error={errors.companyName}
                      icon={<Building2 size={16} />}
                      className={inputTealFocusClass}
                    />
                  </div>

                  <div className="md:col-span-1">
                    <Input 
                      type="text"
                      placeholder="Website (Optional)"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      icon={<Globe size={16} />}
                      className={inputTealFocusClass}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex flex-col gap-1">
                      <Select 
                        label="Country"
                        options={countryOptions}
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        error={errors.country}
                        className="focus:border-accent-teal focus:ring-3 focus:ring-accent-teal/15"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 items-center justify-between mt-6">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleBackStep}
                    className="flex-1 py-3 justify-center rounded-xl"
                  >
                    Back
                  </Button>
                  <Button
                    variant="teal"
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 justify-center rounded-xl"
                  >
                    {isSubmitting ? 'Registering...' : 'Next'}
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

        </Card>
      </motion.div>
    </div>
  );
}
