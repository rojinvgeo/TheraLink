import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

interface BaseInputProps {
  label?: string;
  error?: string;
  textarea?: boolean;
  icon?: ReactNode;
}

export type InputProps = BaseInputProps & 
  InputHTMLAttributes<HTMLInputElement> & 
  TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Input: React.FC<InputProps> = ({
  label,
  error,
  textarea = false,
  className = '',
  id,
  icon,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const inputClass = `form-input ${error ? 'form-input-error' : ''} ${className}`.trim();
  const textareaClass = `form-textarea ${error ? 'form-input-error' : ''} ${className}`.trim();

  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      
      {textarea ? (
        <textarea
          id={inputId}
          className={textareaClass}
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <div className="relative w-full">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 flex items-center justify-center pointer-events-none">
              {icon}
            </span>
          )}
          <input
            id={inputId}
            className={`${inputClass} ${icon ? '!pl-10' : ''}`}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
          />
        </div>
      )}

      {error && (
        <span className="form-error-msg">
          {error}
        </span>
      )}
    </div>
  );
};
