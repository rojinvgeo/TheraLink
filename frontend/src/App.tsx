import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageShell } from './components/layout';
import { 
  HomePage, 
  ServicesPage, 
  OrganizationsPage, 
  FamiliesPage, 
  TherapistsPage, 
  AboutPage, 
  ContactPage, 
  VacanciesPage,
  NotFoundPage,
  AdminLoginPage,
  AdminDashboardPage
} from './pages';
import { Showcase } from './components/ui';

export default function App(): ReactNode {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageShell title="Home - Therapy Staffing & Matching"><HomePage /></PageShell>} />
        <Route path="/services" element={<PageShell title="Our Services"><ServicesPage /></PageShell>} />
        <Route path="/for-organizations" element={<PageShell title="For Organizations"><OrganizationsPage /></PageShell>} />
        <Route path="/for-families" element={<PageShell title="For Families"><FamiliesPage /></PageShell>} />
        <Route path="/for-therapists" element={<PageShell title="For Therapists"><TherapistsPage /></PageShell>} />
        <Route path="/vacancies" element={<PageShell title="Active Placements & Openings"><VacanciesPage /></PageShell>} />
        <Route path="/about" element={<PageShell title="About Us"><AboutPage /></PageShell>} />
        <Route path="/contact" element={<PageShell title="Contact & Inquiry"><ContactPage /></PageShell>} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/showcase" element={<Showcase />} />
        <Route path="*" element={<PageShell title="404 Page Not Found"><NotFoundPage /></PageShell>} />
      </Routes>
    </BrowserRouter>
  );
}
