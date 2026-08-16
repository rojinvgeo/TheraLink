import type { HTMLAttributes, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description: ReactNode;
  variant?: 'success' | 'error' | 'info' | 'warning';
  icon?: ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
  title,
  description,
  variant = 'info',
  icon,
  className = '',
  ...props
}) => {
  const getIcon = () => {
    if (icon) return icon;
    switch (variant) {
      case 'success':
        return <CheckCircle2 size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'info':
      default:
        return <Info size={20} />;
    }
  };

  const alertClass = `alert alert-${variant}`;
  const combinedClasses = `${alertClass} ${className}`.trim();

  return (
    <div className={combinedClasses} {...props}>
      <div className="alert-icon-container">
        {getIcon()}
      </div>
      <div className="alert-content">
        {title && <span className="alert-title">{title}</span>}
        <span className="alert-description">{description}</span>
      </div>
    </div>
  );
};
