import type { TenantSettings } from '../../types';

/** Mock tenant / settings data. */
export const mockSettings: TenantSettings = {
  name: 'Acme Corp',
  slug: 'acme-corp',
  plan: 'Professional',
  mfaEnabled: true,
  auditLogRetention: '90 days',
  usage: [
    { label: 'Indexed Chunks', used: 284000, limit: 500000 },
    { label: 'API Calls',      used: 412000, limit: 2000000 },
    { label: 'Pipelines',     used: 12,     limit: 50 },
    { label: 'Users',         used: 8,      limit: 25 },
  ],
  team: [
    { name: 'Jordan Dev',  email: 'jordan@acme.com', role: 'Admin',          avatar: 'JD' },
    { name: 'Priya Shah',  email: 'priya@acme.com',  role: 'Pipeline Owner', avatar: 'PS' },
    { name: 'Alex Lee',    email: 'alex@acme.com',   role: 'Pipeline Owner', avatar: 'AL' },
    { name: 'Sam Rivers',  email: 'sam@acme.com',    role: 'API Consumer',   avatar: 'SR' },
  ],
};
