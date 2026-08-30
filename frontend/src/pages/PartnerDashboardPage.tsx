import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  Users, 
  Settings, 
  CreditCard, 
  LogOut, 
  MapPin, 
  Briefcase, 
  Calendar, 
  UserCheck, 
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Card, Button, Input, Select, Alert } from '../components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getPartnerDashboardOverview, 
  getCandidates, 
  getCandidateRequests, 
  createCandidateRequest, 
  getPartnerProfile, 
  updatePartnerProfile
} from '../api/partners';
import type {
  Candidate,
  CandidateRequest,
  PartnerProfileData,
  PartnerDashboardOverview
} from '../api/partners';

export default function PartnerDashboardPage(): ReactNode {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'candidates' | 'requests' | 'subscription' | 'profile'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [overview, setOverview] = useState<PartnerDashboardOverview | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [requests, setRequests] = useState<CandidateRequest[]>([]);
  const [profile, setProfile] = useState<PartnerProfileData | null>(null);

  // Candidates Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [jobRoleFilter, setJobRoleFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');

  // UI States
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [requestNotes, setRequestNotes] = useState('');
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  
  // Profile update UI states
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewData, candidatesData, requestsData, profileData] = await Promise.all([
        getPartnerDashboardOverview(),
        getCandidates(),
        getCandidateRequests(),
        getPartnerProfile()
      ]);
      setOverview(overviewData);
      setCandidates(candidatesData);
      setRequests(requestsData);
      setProfile(profileData);
    } catch (err: any) {
      setError(err?.detail || err?.message || 'Failed to load dashboard data. Are you logged in?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    document.title = 'Partner Dashboard | TheraLink';
  }, []);

  // Filter candidates on the client to combine search term and backend properties
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.bio?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = jobRoleFilter ? candidate.job_role === jobRoleFilter : true;
    const matchesLocation = locationFilter ? candidate.location === locationFilter : true;
    const matchesExp = experienceFilter ? candidate.experience_years >= parseInt(experienceFilter) : true;

    return matchesSearch && matchesRole && matchesLocation && matchesExp;
  });

  // Unique lists for filters
  const jobRoles = Array.from(new Set(candidates.map(c => c.job_role)));
  const locations = Array.from(new Set(candidates.map(c => c.location)));

  // Log out
  const handleLogout = () => {
    localStorage.removeItem('theralink_partner_token');
    localStorage.removeItem('theralink_partner_email');
    navigate('/partner/login', { replace: true });
  };

  // Submit candidate request
  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    setIsSubmittingRequest(true);
    setRequestSuccess(false);
    try {
      await createCandidateRequest(selectedCandidate.id, requestNotes);
      setRequestSuccess(true);
      setRequestNotes('');
      // Reload requests
      const requestsData = await getCandidateRequests();
      setRequests(requestsData);
      // Reload metrics
      const overviewData = await getPartnerDashboardOverview();
      setOverview(overviewData);
      setTimeout(() => {
        setSelectedCandidate(null);
        setRequestSuccess(false);
      }, 2000);
    } catch (err: any) {
      alert(err?.non_field_errors?.[0] || err?.message || 'Failed to request candidate.');
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  // Profile update submit
  const handleUpdateProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsUpdatingProfile(true);
    setProfileSuccess(false);
    setProfileErrors({});
    try {
      const updated = await updatePartnerProfile(profile);
      setProfile(updated);
      setProfileSuccess(true);
      // Reload overview for welcome name
      const overviewData = await getPartnerDashboardOverview();
      setOverview(overviewData);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      if (err && typeof err === 'object') {
        setProfileErrors(err);
      } else {
        alert('Failed to update profile details.');
      }
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-base, #f8fafc)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '3px solid var(--color-slate-100, #e2e8f0)',
          borderTopColor: 'var(--color-accent-teal, #0d9488)',
          animation: 'spin 1s linear infinite'
        }} />
        <style dangerouslySetInnerHTML={{__html: `@keyframes spin { to { transform: rotate(360deg); } }`}} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Card className="max-w-md p-6 border border-red-100 text-center">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 font-display">Dashboard Error</h3>
          <p className="text-sm text-slate-600 mt-2 mb-6">{error}</p>
          <Button variant="teal" onClick={fetchData} className="mr-2">Retry</Button>
          <Button variant="outline" onClick={handleLogout}>Log In Again</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-100 flex flex-col shrink-0">
        {/* Branding header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="font-display font-black text-xl text-slate-900">
              Thera<span className="text-brand-blue" style={{ color: 'var(--color-accent-teal, #0d9488)' }}>Link</span>
            </span>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">
              Partner Console
            </div>
          </div>
        </div>

        {/* User Card */}
        {overview && (
          <div className="p-5 border-b border-slate-50 bg-slate-50/50">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Recruitment Partner</div>
            <div className="font-bold text-slate-800 text-sm mt-1 truncate">{overview.partner.company_name}</div>
            <div className="text-xs text-slate-500 truncate mt-0.5">{overview.partner.name}</div>
          </div>
        )}

        {/* Tab Items */}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-teal-50 text-accent-teal'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
            style={{ color: activeTab === 'overview' ? 'var(--color-accent-teal, #0d9488)' : '', backgroundColor: activeTab === 'overview' ? 'rgba(13, 148, 136, 0.08)' : '' }}
          >
            <LayoutDashboard size={18} />
            Overview
          </button>

          <button
            onClick={() => setActiveTab('candidates')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'candidates'
                ? 'bg-teal-50 text-accent-teal'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
            style={{ color: activeTab === 'candidates' ? 'var(--color-accent-teal, #0d9488)' : '', backgroundColor: activeTab === 'candidates' ? 'rgba(13, 148, 136, 0.08)' : '' }}
          >
            <Users size={18} />
            Browse Candidates
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-teal-50 text-accent-teal'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
            style={{ color: activeTab === 'requests' ? 'var(--color-accent-teal, #0d9488)' : '', backgroundColor: activeTab === 'requests' ? 'rgba(13, 148, 136, 0.08)' : '' }}
          >
            <UserCheck size={18} />
            My Requests
          </button>

          <button
            onClick={() => setActiveTab('subscription')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'subscription'
                ? 'bg-teal-50 text-accent-teal'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
            style={{ color: activeTab === 'subscription' ? 'var(--color-accent-teal, #0d9488)' : '', backgroundColor: activeTab === 'subscription' ? 'rgba(13, 148, 136, 0.08)' : '' }}
          >
            <CreditCard size={18} />
            My Subscription
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-teal-50 text-accent-teal'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
            style={{ color: activeTab === 'profile' ? 'var(--color-accent-teal, #0d9488)' : '', backgroundColor: activeTab === 'profile' ? 'rgba(13, 148, 136, 0.08)' : '' }}
          >
            <Settings size={18} />
            Company Profile
          </button>
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && overview && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-3xl p-8 shadow-lg relative overflow-hidden">
                <div className="relative z-10 max-w-lg space-y-2">
                  <h1 className="text-3xl font-extrabold font-display leading-tight">
                    Welcome back, {overview.partner.name}!
                  </h1>
                  <p className="text-teal-50/90 text-sm leading-relaxed">
                    Access candidate matching workflows to identify speech, occupational, physical, and behavioral specialists.
                  </p>
                </div>
                <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 hidden lg:block bg-[radial-gradient(circle_at_bottom_right,var(--color-accent-teal),transparent)]" />
              </div>

              {/* Stats Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-white border border-slate-100 shadow-xs flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Match Requests</div>
                    <div className="text-3xl font-extrabold text-slate-900 font-display">{overview.metrics.total_requests}</div>
                  </div>
                  <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center">
                    <Briefcase size={22} />
                  </div>
                </Card>

                <Card className="p-6 bg-white border border-slate-100 shadow-xs flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Approved Matches</div>
                    <div className="text-3xl font-extrabold text-emerald-600 font-display">{overview.metrics.approved_requests}</div>
                  </div>
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 size={22} />
                  </div>
                </Card>

                <Card className="p-6 bg-white border border-slate-100 shadow-xs flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Days Remaining</div>
                    <div className="text-3xl font-extrabold text-teal-600 font-display">{overview.subscription.days_remaining}</div>
                  </div>
                  <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
                    <Clock size={22} />
                  </div>
                </Card>
              </div>

              {/* Quick Subscription Overview Banner */}
              <Card className="p-6 border border-slate-100 bg-white space-y-4">
                <h3 className="font-display font-bold text-lg text-slate-900">Subscription Status Overview</h3>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-2">
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{overview.subscription.plan_name}</div>
                    <div className="text-xs text-slate-500 mt-1">₹2,500 active partner tier subscription. Valid until {overview.subscription.expiry_date ? new Date(overview.subscription.expiry_date).toLocaleDateString() : 'N/A'}.</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                      Active Subscription
                    </span>
                    <button 
                      onClick={() => setActiveTab('subscription')}
                      className="text-xs text-accent-teal font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      style={{ color: 'var(--color-accent-teal, #0d9488)' }}
                    >
                      View Details
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* TAB 2: BROWSE CANDIDATES */}
          {activeTab === 'candidates' && (
            <motion.div
              key="candidates"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Header */}
              <div>
                <h2 className="text-2xl font-bold font-display text-slate-900">Browse Available Candidates</h2>
                <p className="text-slate-500 text-sm mt-1">Identify qualified clinical specialists and request match coordination support.</p>
              </div>

              {/* Filters Panel */}
              <Card className="p-6 bg-white border border-slate-100 shadow-xs space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search input */}
                  <div className="flex-1 relative flex items-center bg-slate-50 border border-slate-100 rounded-xl px-3 focus-within:border-accent-teal transition-all">
                    <Search size={18} className="text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by name, skills, bio..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-transparent border-0 py-2.5 px-2 outline-hidden text-sm"
                    />
                  </div>

                  {/* Job role Select */}
                  <div className="w-full lg:w-48">
                    <select
                      value={jobRoleFilter}
                      onChange={(e) => setJobRoleFilter(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-3 outline-hidden text-sm text-slate-600 focus:border-accent-teal"
                    >
                      <option value="">All Job Roles</option>
                      {jobRoles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>

                  {/* Location Select */}
                  <div className="w-full lg:w-48">
                    <select
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-3 outline-hidden text-sm text-slate-600 focus:border-accent-teal"
                    >
                      <option value="">All Locations</option>
                      {locations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  {/* Experience Select */}
                  <div className="w-full lg:w-48">
                    <select
                      value={experienceFilter}
                      onChange={(e) => setExperienceFilter(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-3 outline-hidden text-sm text-slate-600 focus:border-accent-teal"
                    >
                      <option value="">Min Experience</option>
                      <option value="2">2+ Years</option>
                      <option value="4">4+ Years</option>
                      <option value="6">6+ Years</option>
                      <option value="8">8+ Years</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Candidates Grid */}
              {filteredCandidates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCandidates.map(candidate => (
                    <motion.div
                      key={candidate.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-slate-200 transition-all"
                    >
                      <div className="space-y-4">
                        {/* Name and Role */}
                        <div className="space-y-1">
                          <h4 className="font-display font-bold text-base text-slate-900">
                            {candidate.first_name} {candidate.last_name}
                          </h4>
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-teal">
                            <Briefcase size={12} />
                            {candidate.job_role}
                          </span>
                        </div>

                        {/* Location / Experience */}
                        <div className="flex gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {candidate.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {candidate.experience_years} Years Exp
                          </span>
                        </div>

                        {/* Bio snippet */}
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {candidate.bio || 'No biography text available.'}
                        </p>

                        {/* Skills pills */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {candidate.skills.split(',').slice(0, 3).map((skill, index) => (
                            <span 
                              key={index}
                              className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-50 text-slate-500 border border-slate-100"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                          {candidate.skills.split(',').length > 3 && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-50 text-slate-400">
                              +{candidate.skills.split(',').length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Detail CTA Button */}
                      <button
                        onClick={() => setSelectedCandidate(candidate)}
                        className="mt-6 w-full py-2.5 rounded-xl border border-slate-100 text-xs font-bold text-slate-600 bg-slate-50/50 hover:bg-teal-50 hover:border-teal-100 hover:text-accent-teal transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        View Profile Details
                        <ChevronRight size={14} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <Card className="p-12 text-center border border-dashed border-slate-200 bg-white">
                  <Users size={40} className="text-slate-300 mx-auto mb-4" />
                  <h4 className="font-display font-semibold text-slate-800">No Candidates Found</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    We couldn't find matches matching your filter options. Try adjusting filters or search term.
                  </p>
                </Card>
              )}

              {/* Candidate Detail Drawer Modal */}
              {selectedCandidate && (
                <div 
                  className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end"
                  onClick={() => setSelectedCandidate(null)}
                >
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto p-6 md:p-8 flex flex-col justify-between"
                  >
                    <div className="space-y-6">
                      {/* Drawer Header */}
                      <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                        <div>
                          <h3 className="font-display font-bold text-xl text-slate-900">
                            {selectedCandidate.first_name} {selectedCandidate.last_name}
                          </h3>
                          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-teal mt-1">
                            <Briefcase size={14} />
                            {selectedCandidate.job_role}
                          </span>
                        </div>
                        <button 
                          onClick={() => setSelectedCandidate(null)}
                          className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Info grid */}
                      <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                        <div className="space-y-0.5">
                          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Location</div>
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                            <MapPin size={12} className="text-slate-400" />
                            {selectedCandidate.location}
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Experience</div>
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                            <Clock size={12} className="text-slate-400" />
                            {selectedCandidate.experience_years} Years
                          </span>
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="space-y-1.5">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Professional Summary</h5>
                        <p className="text-sm text-slate-700 leading-relaxed font-sans">
                          {selectedCandidate.bio || 'No biography details provided.'}
                        </p>
                      </div>

                      {/* Skills */}
                      <div className="space-y-2">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Skills & Focus Areas</h5>
                        <div className="flex flex-wrap gap-2">
                          {selectedCandidate.skills.split(',').map((skill, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 text-xs font-bold rounded-lg bg-teal-50 text-accent-teal"
                              style={{ backgroundColor: 'rgba(13, 148, 136, 0.08)', color: 'var(--color-accent-teal, #0d9488)' }}
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Request match Form */}
                    <div className="border-t border-slate-100 pt-6 mt-6 space-y-4">
                      <div className="space-y-1">
                        <h4 className="font-display font-bold text-sm text-slate-900">Request Candidate Match</h4>
                        <p className="text-xs text-slate-500">TheraLink staff will coordinate credentials verification and introduce you.</p>
                      </div>

                      {requestSuccess ? (
                        <Alert 
                          variant="success"
                          title="Request Submitted"
                          description="Match request has been recorded. We will coordinate details shortly."
                        />
                      ) : (
                        <form onSubmit={handleCreateRequest} className="space-y-3">
                          <textarea
                            placeholder="Add request notes (e.g. clinic requirements, speed, specific shift parameters)..."
                            value={requestNotes}
                            onChange={(e) => setRequestNotes(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl p-3 text-xs outline-hidden focus:border-accent-teal focus:ring-3 focus:ring-accent-teal/15 min-h-[80px]"
                          />
                          <Button
                            variant="teal"
                            type="submit"
                            disabled={isSubmittingRequest}
                            className="w-full py-3 justify-center"
                          >
                            {isSubmittingRequest ? 'Submitting...' : 'Submit Match Request'}
                          </Button>
                        </form>
                      )}
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: MY REQUESTS */}
          {activeTab === 'requests' && (
            <motion.div
              key="requests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Header */}
              <div>
                <h2 className="text-2xl font-bold font-display text-slate-900">My Triage Requests</h2>
                <p className="text-slate-500 text-sm mt-1">Track coordination requests submitted to TheraLink specialists.</p>
              </div>

              {/* Requests list */}
              {requests.length > 0 ? (
                <Card className="bg-white border border-slate-100 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                          <th className="py-4 px-6">Candidate</th>
                          <th className="py-4 px-6">Job Role</th>
                          <th className="py-4 px-6">Date Requested</th>
                          <th className="py-4 px-6">Notes</th>
                          <th className="py-4 px-6">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs divide-y divide-slate-50">
                        {requests.map(req => (
                          <tr key={req.id} className="hover:bg-slate-50/50">
                            <td className="py-4 px-6 font-bold text-slate-800">
                              {req.candidate_details.first_name} {req.candidate_details.last_name}
                            </td>
                            <td className="py-4 px-6 text-slate-500">
                              {req.candidate_details.job_role}
                            </td>
                            <td className="py-4 px-6 text-slate-500">
                              {new Date(req.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-6 text-slate-500 max-w-xs truncate">
                              {req.request_notes || '-'}
                            </td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                req.status === 'approved' 
                                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                  : req.status === 'rejected'
                                  ? 'bg-red-50 border-red-100 text-red-700'
                                  : 'bg-amber-50 border-amber-100 text-amber-700'
                              }`}>
                                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              ) : (
                /* Empty state */
                <Card className="p-12 text-center border border-dashed border-slate-200 bg-white">
                  <UserCheck size={40} className="text-slate-300 mx-auto mb-4" />
                  <h4 className="font-display font-semibold text-slate-800">No Match Requests Yet</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    You haven't requested candidate matches yet. Visit "Browse Candidates" to request.
                  </p>
                </Card>
              )}
            </motion.div>
          )}

          {/* TAB 4: MY SUBSCRIPTION */}
          {activeTab === 'subscription' && overview && (
            <motion.div
              key="subscription"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Header */}
              <div>
                <h2 className="text-2xl font-bold font-display text-slate-900">Subscription details</h2>
                <p className="text-slate-500 text-sm mt-1">Manage active partner subscriptions and billing history details.</p>
              </div>

              {/* Active subscription card */}
              <Card className="p-6 md:p-8 bg-white border border-slate-100 shadow-xs space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Plan</span>
                    <h3 className="text-xl font-extrabold text-slate-900 font-display mt-0.5">
                      {overview.subscription.plan_name}
                    </h3>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                  <div className="space-y-0.5">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Plan Cost</div>
                    <span className="text-sm font-bold text-slate-800">₹{parseFloat(overview.subscription.amount).toLocaleString('en-IN')}.00 INR</span>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Term Period</div>
                    <span className="text-sm font-bold text-slate-800">3 Years (36 Months)</span>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Expiry Date</div>
                    <span className="text-sm font-bold text-slate-800">
                      {overview.subscription.expiry_date ? new Date(overview.subscription.expiry_date).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Dates display progress */}
                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400 font-bold uppercase">
                    <span>Started: {overview.subscription.start_date ? new Date(overview.subscription.start_date).toLocaleDateString() : 'N/A'}</span>
                    <span>Expires: {overview.subscription.expiry_date ? new Date(overview.subscription.expiry_date).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-accent-teal h-2 transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, Math.max(0, (overview.subscription.days_remaining / (3 * 365)) * 100))}%`,
                        backgroundColor: 'var(--color-accent-teal, #0d9488)'
                      }}
                    />
                  </div>
                  <div className="text-xs text-slate-500 text-right">{overview.subscription.days_remaining} active days remaining in term.</div>
                </div>
              </Card>

              {/* Invoicing notes */}
              <Card className="p-6 border border-slate-100 bg-white space-y-3">
                <h4 className="font-display font-bold text-sm text-slate-900">Billing details & Inquiries</h4>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                  For billing receipts, invoice adjustments, custom recruitment contracts, or changing payment credentials, please coordinate directly with the TheraLink support desk.
                </p>
                <div className="pt-2">
                  <Button variant="outline" size="sm" onClick={() => navigate('/contact')} className="flex items-center gap-1">
                    Contact Billing Support
                    <ExternalLink size={12} />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* TAB 5: PROFILE EDIT */}
          {activeTab === 'profile' && profile && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6 animate-fade-in"
            >
              {/* Header */}
              <div>
                <h2 className="text-2xl font-bold font-display text-slate-900">Company & Contact Profile</h2>
                <p className="text-slate-500 text-sm mt-1">Manage partner details and coordinate info records.</p>
              </div>

              {/* Form */}
              <Card className="p-6 md:p-8 bg-white border border-slate-100 shadow-xs">
                <form onSubmit={handleUpdateProfileSubmit} className="space-y-6">
                  
                  {profileSuccess && (
                    <Alert
                      variant="success"
                      title="Success"
                      description="Your profile details have been updated successfully."
                    />
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">First Name</label>
                      <Input
                        type="text"
                        value={profile.first_name}
                        onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                        error={profileErrors['first_name']}
                        required
                      />
                    </div>

                    {/* Last name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Last Name</label>
                      <Input
                        type="text"
                        value={profile.last_name}
                        onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                        error={profileErrors['last_name']}
                        required
                      />
                    </div>

                    {/* Email (Readonly) */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Registered Email (Disabled)</label>
                      <Input
                        type="email"
                        value={profile.email}
                        readOnly
                        className="bg-slate-50/70 border-slate-100 text-slate-400 cursor-not-allowed"
                      />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Phone Number</label>
                      <Input
                        type="text"
                        value={profile.phone_number}
                        onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                        error={profileErrors['phone_number']}
                        required
                      />
                    </div>

                    {/* Company name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Company Name</label>
                      <Input
                        type="text"
                        value={profile.company_name}
                        onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                        error={profileErrors['company_name']}
                        required
                      />
                    </div>

                    {/* Website */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Website Address</label>
                      <Input
                        type="text"
                        value={profile.website}
                        onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                        error={profileErrors['website']}
                        placeholder="https://company.com"
                      />
                    </div>

                    {/* Country */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Country</label>
                      <select
                        value={profile.country}
                        onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3 px-3 outline-hidden text-sm focus:border-accent-teal"
                      >
                        <option value="India">India</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <Button
                      variant="teal"
                      type="submit"
                      disabled={isUpdatingProfile}
                      className="px-6 py-3 shadow-md"
                    >
                      {isUpdatingProfile ? 'Saving Details...' : 'Save Profile Details'}
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
