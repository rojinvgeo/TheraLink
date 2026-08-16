import type { ReactNode } from 'react';
import type { Vacancy } from './vacancyTypes';
import { VacancyCard } from './VacancyCard';
import { VacanciesEmptyState } from './VacanciesEmptyState';

interface VacanciesListProps {
  vacancies: Vacancy[];
}

export function VacanciesList({ vacancies }: VacanciesListProps): ReactNode {
  if (vacancies.length === 0) {
    return <VacanciesEmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {vacancies.map((vacancy) => (
        <VacancyCard key={vacancy.id} vacancy={vacancy} />
      ))}
    </div>
  );
}
export default VacanciesList;
