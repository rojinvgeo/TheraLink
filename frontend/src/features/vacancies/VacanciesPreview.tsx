import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button, Badge } from '../../components/ui';
import type { Vacancy } from './vacancyTypes';
import { VacancyCard } from './VacancyCard';
import { motion } from 'framer-motion';

interface VacanciesPreviewProps {
  vacancies: Vacancy[];
}

export function VacanciesPreview({ vacancies }: VacanciesPreviewProps): ReactNode {
  const navigate = useNavigate();

  // Show at most 3 vacancies in the preview
  const previewVacancies = vacancies.slice(0, 3);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col gap-8 w-full"
    >
      <div className="text-center flex flex-col items-center gap-2">
        <Badge variant="blue" icon={<Sparkles size={12} className="animate-pulse" />}>
          Now Hiring
        </Badge>
        <h2 className="font-display text-3xl font-bold text-slate-900">
          Active Placement Openings
        </h2>
        <p className="text-slate-600 max-w-lg">
          Explore active recruitment opportunities in our clinical and educational partner network.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {previewVacancies.map((vacancy) => (
          <VacancyCard key={vacancy.id} vacancy={vacancy} />
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate('/vacancies')}
          icon={<ArrowRight size={18} />}
          iconPosition="right"
          className="shadow-sm hover:shadow-md hover:bg-slate-50 transition-all duration-300"
        >
          View All Opportunities
        </Button>
      </div>
    </motion.section>
  );
}
export default VacanciesPreview;
