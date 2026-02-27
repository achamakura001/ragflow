import React from 'react';

interface ProviderCardProps {
  logo: string;
  name: string;
  desc: string;
  selected?: boolean;
  onClick?: () => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ logo, name, desc, selected, onClick }) => (
  <div className={"provider-card" + (selected ? " selected" : "")} onClick={onClick}>
    {selected && <span className="provider-check">✓</span>}
    <div className="provider-card-logo">{logo}</div>
    <div className="provider-card-name">{name}</div>
    <div className="provider-card-desc">{desc}</div>
  </div>
);
