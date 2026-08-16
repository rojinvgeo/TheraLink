import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, ArrowRight } from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui';
import type { Vacancy } from './vacancyTypes';

interface VacancyCardProps {
  vacancy: Vacancy;
}

export function VacancyCard({ vacancy }: VacancyCardProps): ReactNode {
  const navigate = useNavigate();

  const getEmploymentTypeLabel = (type?: string) => {
    switch (type) {
      case 'full_time':
        return 'Full Time';
      case 'part_time':
        return 'Part Time';
      case 'contract':
        return 'Contract';
      case 'temporary':
        return 'Temporary';
      case 'other':
        return 'Other';
      default:
        return type || '';
    }
  };

  const handleInterestClick = () => {
    navigate(`/contact?type=therapist&vacancy=${vacancy.slug}`);
  };

  return (
    <Card hoverable className="flex flex-col h-full bg-white p-6 justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-accent-purple/40 hover:shadow-purple-500/5">
      <div className="flex flex-col gap-3">
        <h3 className="font-display text-xl font-bold text-slate-900 leading-tight">
          {vacancy.title}
        </h3>
        
        <div className="flex flex-wrap gap-2 mb-2">
          {vacancy.location && (
            <Badge variant="blue" icon={<MapPin size={12} />}>
              {vacancy.location}
            </Badge>
          )}
          {vacancy.employmentType && (
            <Badge variant="purple" icon={<Briefcase size={12} />}>
              {getEmploymentTypeLabel(vacancy.employmentType)}
            </Badge>
          )}
        </div>

        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          {vacancy.summary}
        </p>
      </div>

      <Button
        variant="purple"
        onClick={handleInterestClick}
        className="w-full justify-center mt-auto"
        icon={<ArrowRight size={16} />}
        iconPosition="right"
      >
        Express Interest
      </Button>
    </Card>
  );
}
export default VacancyCard;
