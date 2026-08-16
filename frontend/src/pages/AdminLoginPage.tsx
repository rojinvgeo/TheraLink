import type { ReactNode, FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, AlertTriangle, ArrowRight } from 'lucide-react';
import { Card, Button, Input, Alert } from '../components/ui';
import { apiRequest } from '../api/client';

export default function AdminLoginPage(): ReactNode {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set admin document title
    document.title = 'Staff Login | TheraLink Admin';
    
    // Redirect if already logged in
    if (localStorage.getItem('theralink_admin_token')) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    apiRequest<{ token: string }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
      .then((res) => {
        setIsLoading(false);
        localStorage.setItem('theralink_admin_token', res.token);
        navigate('/admin/dashboard', { replace: true });
      })
      .catch((err) => {
        setIsLoading(false);
        if (err && typeof err === 'object') {
          if (err.non_field_errors) {
            setError(err.non_field_errors.join(' '));
          } else if (err.detail) {
            setError(err.detail);
          } else {
            setError('Invalid username or password. Please try again.');
          }
        } else {
          setError('A network error occurred. Please verify the backend server is running.');
        }
      });
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--color-bg-base, #f8fafc)',
      padding: 'var(--space-6)'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: '420px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'var(--color-purple-light, #f3e8ff)',
            color: 'var(--color-purple, #7c3aed)',
            marginBottom: 'var(--space-4)'
          }}>
            <Lock size={24} />
          </div>
          <h1 style={{
            fontSize: '1.8rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            color: 'var(--color-text-primary, #0f172a)'
          }}>
            TheraLink Admin
          </h1>
          <p style={{
            color: 'var(--color-text-secondary, #64748b)',
            fontSize: '0.9rem',
            marginTop: 'var(--space-1.5)'
          }}>
            Enter your credentials to access the staff console
          </p>
        </div>

        <Card style={{ padding: 'var(--space-6)' }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {error && (
              <Alert
                variant="error"
                title="Login Failed"
                icon={<AlertTriangle size={20} />}
                description={error}
              />
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1.5)' }}>
              <label htmlFor="username" style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1.5)' }}>
              <label htmlFor="password" style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)',
                backgroundColor: 'var(--color-purple, #7c3aed)',
                borderColor: 'var(--color-purple, #7c3aed)'
              }}
            >
              {isLoading ? 'Checking Credentials...' : 'Access Staff Console'}
              {!isLoading && <ArrowRight size={16} />}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
