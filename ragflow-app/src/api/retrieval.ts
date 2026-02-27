/**
 * Retrieval service.
 * Executes semantic search queries against a pipeline's vector store.
 */

import { apiFetch, USE_MOCK, mockDelay } from './client';
import type { RetrievalRequest, RetrievalResult } from '../types';

const MOCK_RESULTS: Record<string, RetrievalResult[]> = {
  default: [
    {
      score: 0.94,
      source: 'employee_handbook_2024.docx · Page 14',
      text: 'Eligible employees may take up to 16 weeks of fully paid parental leave following the birth, adoption, or foster placement of a child. Leave may be taken consecutively or intermittently within 12 months of the qualifying event. Both primary and secondary caregivers are eligible.',
    },
    {
      score: 0.87,
      source: 'benefits_guide.pdf · Page 3',
      text: 'Parental Leave Benefits: Employees must notify HR at least 30 days before anticipated leave when possible. During leave, all health benefits remain active at the company-sponsored rate. Employees returning from leave are guaranteed reinstatement to their same or equivalent position.',
    },
    {
      score: 0.81,
      source: 'employee_handbook_2024.docx · Page 16',
      text: 'Short-Term Disability and Parental Leave may run concurrently for the birth parent. Contact your HR Business Partner to coordinate overlapping leave types. For adoption or surrogacy, documentation of placement is required within 14 days.',
    },
  ],
};

/** Run a retrieval query against a pipeline. */
export async function retrieve(req: RetrievalRequest): Promise<RetrievalResult[]> {
  if (USE_MOCK) {
    await mockDelay(600);
    return MOCK_RESULTS.default;
  }
  return apiFetch<RetrievalResult[]>('/retrieve', {
    method: 'POST',
    body: JSON.stringify(req),
  });
}
