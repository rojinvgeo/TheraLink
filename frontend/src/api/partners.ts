import { apiRequest } from './client';

export interface PartnerRegisterInput {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
  company_name: string;
  website?: string;
  country: string;
}

export interface PartnerRegisterResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  razorpay_order_id?: string | null;
  razorpay_key_id?: string;
  amount_paise?: number;
  currency?: string;
}

export async function registerPartner(input: PartnerRegisterInput): Promise<PartnerRegisterResponse> {
  return apiRequest<PartnerRegisterResponse>('/partner/register/', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export interface PartnerDetail {
  id: number;
  name: string;
  email: string;
  date_joined: string;
  phone_number: string;
  company_name: string;
  website?: string;
  country: string;
}

export async function getAdminPartners(): Promise<PartnerDetail[]> {
  return apiRequest<PartnerDetail[]>('/admin/partners/', {
    method: 'GET',
  });
}

export interface PaymentVerifyInput {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentVerifyResponse {
  success: boolean;
  message: string;
}

export interface PaymentRetryInput {
  email: string;
}

export interface PaymentRetryResponse {
  success: boolean;
  message: string;
  already_active: boolean;
  user?: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    company_name: string;
  };
  razorpay_order_id?: string;
  razorpay_key_id?: string;
  amount_paise?: number;
  currency?: string;
}

export async function verifyPartnerPayment(input: PaymentVerifyInput): Promise<PaymentVerifyResponse> {
  return apiRequest<PaymentVerifyResponse>('/partner/payment/verify/', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function retryPartnerPayment(input: PaymentRetryInput): Promise<PaymentRetryResponse> {
  return apiRequest<PaymentRetryResponse>('/partner/payment/retry/', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}


export interface Candidate {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  job_role: string;
  location: string;
  experience_years: number;
  skills: string;
  bio: string;
  status: string;
  created_at: string;
}

export interface CandidateRequest {
  id: number;
  candidate: number;
  candidate_details: Candidate;
  status: 'pending' | 'approved' | 'rejected';
  request_notes?: string;
  created_at: string;
}

export interface PartnerProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  company_name: string;
  website: string;
  country: string;
}

export interface PartnerDashboardOverview {
  partner: {
    company_name: string;
    name: string;
    email: string;
  };
  subscription: {
    plan_name: string;
    amount: string;
    is_active: boolean;
    start_date: string | null;
    expiry_date: string | null;
    days_remaining: number;
  };
  metrics: {
    total_requests: number;
    pending_requests: number;
    approved_requests: number;
  };
}

export async function checkPartnerAuth(): Promise<{ success: boolean; has_active_subscription: boolean; user?: any }> {
  return apiRequest<{ success: boolean; has_active_subscription: boolean; user?: any }>('/partner/check-auth/', {
    method: 'GET',
  });
}

export async function getPartnerDashboardOverview(): Promise<PartnerDashboardOverview> {
  return apiRequest<PartnerDashboardOverview>('/partner/dashboard/', {
    method: 'GET',
  });
}

export async function getCandidates(filters?: {
  job_role?: string;
  location?: string;
  experience_years?: number | string;
  skills?: string;
}): Promise<Candidate[]> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
  }
  const queryStr = params.toString() ? `?${params.toString()}` : '';
  return apiRequest<Candidate[]>(`/partner/candidates/${queryStr}`, {
    method: 'GET',
  });
}

export async function getCandidateDetail(id: number): Promise<Candidate> {
  return apiRequest<Candidate>(`/partner/candidates/${id}/`, {
    method: 'GET',
  });
}

export async function getCandidateRequests(): Promise<CandidateRequest[]> {
  return apiRequest<CandidateRequest[]>('/partner/requests/', {
    method: 'GET',
  });
}

export async function createCandidateRequest(candidateId: number, notes?: string): Promise<CandidateRequest> {
  return apiRequest<CandidateRequest>('/partner/requests/', {
    method: 'POST',
    body: JSON.stringify({ candidate: candidateId, request_notes: notes }),
  });
}

export async function getPartnerProfile(): Promise<PartnerProfileData> {
  return apiRequest<PartnerProfileData>('/partner/profile/', {
    method: 'GET',
  });
}

export async function updatePartnerProfile(data: PartnerProfileData): Promise<PartnerProfileData> {
  return apiRequest<PartnerProfileData>('/partner/profile/', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}



