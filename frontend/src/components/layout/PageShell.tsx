import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';

export interface PageShellProps {
  children: ReactNode;
  title?: string;
}

export function PageShell({ children, title }: PageShellProps): ReactNode {
  useEffect(() => {
    document.title = title ? `${title} | TheraLink` : 'TheraLink - Therapy Staffing & Matching';
  }, [title]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <SiteHeader />
      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ 
          flex: 1, 
          padding: 'var(--space-8) var(--space-6)', 
          maxWidth: '1200px', 
          width: '100%', 
          margin: '0 auto' 
        }}
      >
        {children}
      </motion.main>
      <SiteFooter />
    </div>
  );
}
export default PageShell;
