/**
 *  uses the mockup's .btn CSS classes.Button 
 */
import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size    = 'sm' | 'md';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size    = 'md',
  className = '',
  children,
  ...rest
}) => (
  <button
    className={`btn btn-${variant}${size === 'sm' ? ' btn-sm' : ''} ${className}`}
    {...rest}
  >
    {children}
  </button>
);
