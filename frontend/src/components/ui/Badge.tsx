import type { HTMLAttributes, ReactNode } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'blue' | 'teal' | 'orange' | 'purple';
  icon?: ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'blue',
  icon,
  className = '',
  ...props
}) => {
  const badgeClass = `badge badge-${variant}`;
  const combinedClasses = `${badgeClass} ${className}`.trim();

  return (
    <span className={combinedClasses} {...props}>
      {icon && (
        <span className="badge-icon" style={{ display: 'inline-flex', marginRight: '4px' }}>
          {icon}
        </span>
      )}
      {children}
    </span>
  );
};
