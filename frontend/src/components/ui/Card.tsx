import type { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  flat?: boolean;
  bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  flat = false,
  bordered = true,
  className = '',
  ...props
}) => {
  const classes = [
    'card',
    hoverable ? 'card-hover' : '',
    flat ? 'card-flat' : '',
    bordered ? 'card-bordered' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};
