/**
 * Badge - status chip with a coloured dot.
 */
import React from 'react';

type StatusValue = 'active' | 'indexing' | 'draft' | 'error' | 'revoked';

const LABEL: Record<string, string> = {
  active: 'Active', indexing: 'Indexing', draft: 'Draft',
  error: 'Error', revoked: 'Revoked',
};

interface BadgeProps { status: StatusValue | string; }

export const Badge: React.FC<BadgeProps> = ({ status }) => (
  <span className={"badge " + status}>
    <span className="badge-dot" />
    {LABEL[status] ?? status}
  </span>
);
