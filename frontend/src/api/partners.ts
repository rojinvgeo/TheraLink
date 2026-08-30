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


