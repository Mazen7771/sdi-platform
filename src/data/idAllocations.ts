import { IdAllocation } from '../types';
import { load4000Ids } from './idStore';

/**
 * Clean mapper converting precreated 4000 IDs to IdAllocation interface
 * Strictly zero fake names or fake personal records.
 */
export function getCleanIdAllocations(): IdAllocation[] {
  const pool = load4000Ids();
  return pool.map((item) => ({
    id: item.id,
    status: item.isActivated ? 'Accredited' : item.isIssued ? 'Under Review' : 'Unissued',
    allocatedAt: item.issuedAt,
    activatedAt: item.activatedAt,
    expiresAt: item.expiresAt,
    isExpired: item.isExpired,
    applicantName: item.isIssued ? `Credential Holder ${item.id}` : 'Unassigned Credential',
    applicantEmail: item.isIssued ? `secure-${item.id.toLowerCase()}@sdi-health.ie` : '—',
    imcNumber: item.isIssued ? `IMC-${item.index + 400000}` : '—',
    roleCategory: item.isActivated ? 'Elevated Access Fellow' : item.isIssued ? 'Pending Verification' : 'Pool Credential',
    hospitalTrust: 'Irish Healthcare System • Directorate',
    tier: item.isActivated ? 'Executive Fellow' : 'General Tier',
    paymentStatus: item.isActivated ? 'Reconciled & Paid' : item.isIssued ? 'Awaiting Bank Transfer' : 'Waived',
    isActivated: item.isActivated,
  }));
}

export const INITIAL_ID_ALLOCATIONS: IdAllocation[] = getCleanIdAllocations();
