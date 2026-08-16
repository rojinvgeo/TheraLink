import { apiRequest } from './client';
import type { Vacancy } from '../features/vacancies/vacancyTypes';

// Helper to convert snake_case backend vacancy to camelCase frontend vacancy
function mapBackendToFrontend(v: any): Vacancy {
  return {
    id: v.id,
    title: v.title,
    slug: v.slug,
    location: v.location || undefined,
    employmentType: v.employment_type || undefined,
    summary: v.summary,
    description: v.description || undefined,
    postedAt: v.posted_at || undefined,
    status: v.status || undefined,
  };
}

// Helper to convert camelCase frontend vacancy to snake_case backend vacancy
function mapFrontendToBackend(v: any): any {
  const mapped: any = {};
  if (v.title !== undefined) mapped.title = v.title;
  if (v.slug !== undefined) mapped.slug = v.slug;
  if (v.location !== undefined) mapped.location = v.location || null;
  if (v.summary !== undefined) mapped.summary = v.summary;
  if (v.description !== undefined) mapped.description = v.description || null;
  if (v.status !== undefined) mapped.status = v.status;
  if (v.employmentType !== undefined) mapped.employment_type = v.employmentType || null;
  if (v.postedAt !== undefined) mapped.posted_at = v.postedAt || null;
  return mapped;
}

export async function getVacancies(publicOnly = true): Promise<Vacancy[]> {
  const endpoint = publicOnly ? '/vacancies/' : '/admin/vacancies/';
  const data = await apiRequest<any[]>(endpoint);
  return data.map(mapBackendToFrontend);
}

export async function createVacancy(input: Omit<Vacancy, 'id' | 'postedAt'>): Promise<Vacancy[]> {
  const backendInput = mapFrontendToBackend(input);
  await apiRequest<any>('/admin/vacancies/', {
    method: 'POST',
    body: JSON.stringify(backendInput),
  });
  return getVacancies(false);
}

export async function updateVacancy(id: string, updates: Partial<Vacancy>): Promise<Vacancy[]> {
  const backendInput = mapFrontendToBackend(updates);
  await apiRequest<any>(`/admin/vacancies/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(backendInput),
  });
  return getVacancies(false);
}
