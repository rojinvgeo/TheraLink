import { apiRequest } from './client';

export interface InquiryInput {
  inquiry_type: string;
  name: string;
  email?: string;
  phone?: string;
  organization_name?: string;
  role_or_profession?: string;
  location?: string;
  preferred_contact_method?: string;
  therapist_type_needed?: string;
  message: string;
  consent: boolean;
  vacancy_context?: string;
}

export interface InquiryResponse {
  id: string;
  inquiry_type: string;
  status: string;
  created_at: string;
}

export interface Inquiry {
  id: string;
  inquiry_type: 'organization' | 'family' | 'therapist' | 'other';
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'closed';
  name: string;
  email?: string;
  phone?: string;
  organization_name?: string;
  role_or_profession?: string;
  location?: string;
  preferred_contact_method?: 'email' | 'phone';
  therapist_type_needed?: string;
  message: string;
  consent: boolean;
  internal_notes?: string;
  vacancy_context?: string;
  created_at: string;
  updated_at?: string;
}

// 1. Submit Inquiry - Public Form
export async function createInquiry(input: InquiryInput): Promise<InquiryResponse> {
  return apiRequest<InquiryResponse>('/inquiries/', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

// 2. Retrieve all inquiries - Staff Only
export async function getInquiries(): Promise<Inquiry[]> {
  return apiRequest<Inquiry[]>('/admin/inquiries/');
}

// 3. Update inquiry status or internal notes - Staff Only
export async function updateInquiry(id: string, updates: Partial<Inquiry>): Promise<Inquiry> {
  return apiRequest<Inquiry>(`/admin/inquiries/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}
