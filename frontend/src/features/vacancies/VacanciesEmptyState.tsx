import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox, ArrowRight } from 'lucide-react';
import { Card, Button } from '../../components/ui';

export function VacanciesEmptyState(): ReactNode {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col items-center text-center p-12 max-w-2xl mx-auto border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl shadow-xs">
      <div className="text-slate-400 bg-slate-150/50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
        <Inbox size={32} />
      </div>
      
      <h3 className="font-display text-2xl font-bold text-slate-900 mb-3">
        No vacancies are open right now.
      </h3>
      
      <p className="text-slate-600 max-w-md leading-relaxed mb-8">
        You can still contact TheraLink to express interest in joining our therapist talent pool. We are constantly matching clinicians with new assignments.
      </p>

      <Button
        variant="purple"
        size="lg"
        onClick={() => navigate('/contact?type=therapist')}
        icon={<ArrowRight size={18} />}
        iconPosition="right"
      >
        Join the Talent Pool
      </Button>
    </Card>
  );
}
export default VacanciesEmptyState;
