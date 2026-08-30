export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options?.headers as Record<string, string>,
  };

  // Retrieve token and append Token Authorization header
  const adminToken = localStorage.getItem('theralink_admin_token');
  const partnerToken = localStorage.getItem('theralink_partner_token');
  
  if (endpoint.startsWith('/admin/') && adminToken) {
    headers['Authorization'] = `Token ${adminToken}`;
  } else if (partnerToken) {
    headers['Authorization'] = `Token ${partnerToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      if (endpoint.startsWith('/admin/')) {
        localStorage.removeItem('theralink_admin_token');
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
      } else {
        localStorage.removeItem('theralink_partner_token');
        localStorage.removeItem('theralink_partner_email');
        if (typeof window !== 'undefined') {
          window.location.href = '/partner/login';
        }
      }
    }
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { detail: 'An unexpected network error occurred.' };
    }
    throw errorData;
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
