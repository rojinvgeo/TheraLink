export interface Vacancy {
  id: string;
  title: string;
  slug: string;
  location?: string;
  employmentType?: 'full_time' | 'part_time' | 'contract' | 'temporary' | 'other';
  summary: string;
  description?: string;
  postedAt?: string;
  status?: 'draft' | 'active' | 'closed' | 'archived';
}
