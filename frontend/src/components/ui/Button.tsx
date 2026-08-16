import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'teal' | 'orange' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}) => {
  const sizeClass = `btn-${size}`;
  const variantClass = `btn-${variant}`;
  const combinedClasses = `btn ${variantClass} ${sizeClass} ${className}`.trim();

  return (
    <button
      className={combinedClasses}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="btn-icon btn-icon-left" style={{ display: 'inline-flex', alignSelf: 'center' }}>
          {icon}
        </span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="btn-icon btn-icon-right" style={{ display: 'inline-flex', alignSelf: 'center' }}>
          {icon}
        </span>
      )}
    </button>
  );
};
