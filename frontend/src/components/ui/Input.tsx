import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface BaseInputProps {
  label?: string;
  error?: string;
  textarea?: boolean;
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
        <input
          id={inputId}
          className={inputClass}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {error && (
        <span className="form-error-msg">
          {error}
        </span>
      )}
    </div>
  );
};
