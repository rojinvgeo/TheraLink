import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { checkPartnerAuth } from '../../api/partners';

interface PartnerProtectedRouteProps {
  children: ReactNode;
}

export function PartnerProtectedRoute({ children }: PartnerProtectedRouteProps): ReactNode {
  const token = localStorage.getItem('theralink_partner_token');
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    checkPartnerAuth()
      .then((res) => {
        setIsAuthorized(res.success && res.has_active_subscription);
        setLoading(false);
      })
      .catch(() => {
        setIsAuthorized(false);
        setLoading(false);
      });
  }, [token]);

  if (!token) {
    return <Navigate to="/partner/login" replace />;
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-base, #f8fafc)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '3px solid var(--color-slate-100, #e2e8f0)',
          borderTopColor: 'var(--color-accent-teal, #0d9488)',
          animation: 'spin 1s linear infinite'
        }} />
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}} />
      </div>
    );
  }

  if (!isAuthorized) {
    // Save email in storage so registration can pick it up for retry auto-prefill
    const email = localStorage.getItem('theralink_partner_email');
    return <Navigate to="/partner/register" state={{ paymentPending: true, email }} replace />;
  }

  return <>{children}</>;
}
