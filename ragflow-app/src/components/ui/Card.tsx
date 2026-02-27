/**
 *  white container with border/radius using the mockup's .card class.Card 
 */
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  noPadding?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, noPadding, className = '' }) => (
  <div className={`card${noPadding ? ' p-0' : ''} ${className}`}>
    {children}
  </div>
);
