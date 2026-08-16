import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, AlertTriangle, RefreshCw, Mail } from 'lucide-react';
import { Badge, Button, Alert } from '../components/ui';
import type { Vacancy } from '../features/vacancies/vacancyTypes';
import { VacanciesList } from '../features/vacancies/VacanciesList';
import { getVacancies } from '../api/vacancies';
import { motion } from 'framer-motion';

export default function VacanciesPage(): ReactNode {
  const navigate = useNavigate();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVacancies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getVacancies();
      setVacancies(data);
    } catch (err) {
      setError('Failed to load active vacancies. Please try again or contact us directly.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
      {/* HEADER SECTION */}
      <section style={{ borderBottom: '1px solid var(--color-border-base)', paddingBottom: 'var(--space-8)' }}>
        <Badge variant="purple" icon={<Briefcase size={12} />}>Opportunities</Badge>
        <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: 700, marginTop: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
          Active Placements & Openings
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '650px', lineHeight: '1.5', fontSize: '1.05rem' }}>
          Explore current staffing vacancies within our school district, clinical facility, and in-home therapist network. Find your next rewarding assignment.
        </p>
      </section>

      {/* DYNAMIC CONTENT CONTAINER */}
      <div style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-4)', padding: 'var(--space-12) 0' }}>
            <RefreshCw className="animate-spin text-brand-blue" size={32} />
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem' }}>Retrieving open vacancies...</p>
          </div>
        ) : error ? (
          <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Alert 
              variant="error" 
              title="Connection Error" 
              icon={<AlertTriangle size={20} />}
              description={error}
            />
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
              <Button variant="outline" onClick={fetchVacancies} icon={<RefreshCw size={16} />}>
                Try Again
              </Button>
              <Button variant="primary" onClick={() => navigate('/contact?type=therapist')} icon={<Mail size={16} />}>
                Contact Coordinator
              </Button>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <VacanciesList vacancies={vacancies} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
