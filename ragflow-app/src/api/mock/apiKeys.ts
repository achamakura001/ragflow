import type { ApiKey } from '../../types';

/** Mock API keys. */
export const mockApiKeys: ApiKey[] = [
  {
    id: 'key_prod',
    name: 'Production Agent',
    key: 'rf_prod_********************4a2f',
    scope: 'All Pipelines',
    createdAt: 'Dec 12, 2024',
    calls30d: 41200,
    status: 'active',
  },
  {
    id: 'key_stg',
    name: 'Staging Agent',
    key: 'rf_stg_********************8b3c',
    scope: 'Product KB, HR Policy',
    createdAt: 'Nov 5, 2024',
    calls30d: 8400,
    status: 'active',
  },
  {
    id: 'key_ci',
    name: 'CI/CD Testing',
    key: 'rf_test_*******************1e9d',
    scope: 'HR Policy (Read-Only)',
    createdAt: 'Oct 2, 2024',
    calls30d: 1100,
    status: 'active',
  },
  {
    id: 'key_legacy',
    name: 'Legacy Key',
    key: 'rf_old_********************0f7a',
    scope: 'All Pipelines',
    createdAt: 'Aug 1, 2024',
    calls30d: 0,
    status: 'revoked',
  },
];
