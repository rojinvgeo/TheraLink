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

