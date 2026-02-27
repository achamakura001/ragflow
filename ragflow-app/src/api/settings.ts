/**
 * Settings / Tenant API service.
 */

import { apiFetch, USE_MOCK, mockDelay } from './client';
import { mockSettings } from './mock/settings';
import type { TenantSettings } from '../types';

/** Fetch current tenant settings. */
export async function getSettings(): Promise<TenantSettings> {
  if (USE_MOCK) {
    await mockDelay();
    return { ...mockSettings };
  }
  return apiFetch<TenantSettings>('/settings');
}

/** Persist updated tenant settings. */
export async function updateSettings(
  data: Partial<TenantSettings>,
): Promise<TenantSettings> {
  if (USE_MOCK) {
    await mockDelay(400);
    return { ...mockSettings, ...data };
  }
  return apiFetch<TenantSettings>('/settings', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/** Invite a new team member. */
export async function inviteMember(email: string, role: string): Promise<void> {
  if (USE_MOCK) {
    await mockDelay(400);
    return;
  }
  return apiFetch<void>('/settings/team/invite', {
    method: 'POST',
    body: JSON.stringify({ email, role }),
  });
}
