import { PrecreatedId } from '../types';

export const ID_POOL_SIZE = 4000;
const STORAGE_KEY = 'sdi_4000_ids_pool_v3';
const CURRENT_SESSION_ID_KEY = 'sdi_current_session_id_v3';

/**
 * 1 Year in milliseconds: 365 days
 */
export const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

/**
 * Generate 4000 pristine precreated IDs: SDI-0001 through SDI-4000
 * Strictly zero fake names or fabricated personal data.
 */
export function generateInitial4000Ids(): PrecreatedId[] {
  const pool: PrecreatedId[] = [];
  for (let i = 1; i <= ID_POOL_SIZE; i++) {
    const padded = String(i).padStart(4, '0');
    pool.push({
      id: `SDI-${padded}`,
      index: i,
      isIssued: false,
      isActivated: false,
    });
  }
  return pool;
}

/**
 * Load the 4000 IDs from localStorage and automatically enforce yearly expiration:
 * Any account active for more than 1 year is AUTOMATICALLY deactivated.
 */
export function load4000Ids(): PrecreatedId[] {
  let pool: PrecreatedId[] = [];
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PrecreatedId[];
        if (Array.isArray(parsed) && parsed.length === ID_POOL_SIZE) {
          pool = parsed;
        }
      }
    }
  } catch (err) {
    console.error('Failed to load 4000 ID pool from localStorage', err);
  }

  if (pool.length !== ID_POOL_SIZE) {
    pool = generateInitial4000Ids();
    save4000Ids(pool);
    return pool;
  }

  // --- AUTOMATIC YEARLY SUBSCRIPTION EXPIRATION CHECK ---
  const now = Date.now();
  let updatedAny = false;

  pool = pool.map((item) => {
    if (item.isActivated && item.expiresAt) {
      const expiryTimestamp = new Date(item.expiresAt).getTime();
      if (now >= expiryTimestamp) {
        // Automatically deactivate upon 1-year expiration
        updatedAny = true;
        return {
          ...item,
          isActivated: false,
          isExpired: true,
        };
      }
    }
    return item;
  });

  if (updatedAny) {
    save4000Ids(pool);
  }

  return pool;
}

/**
 * Save the 4000 IDs into localStorage.
 */
export function save4000Ids(pool: PrecreatedId[]): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pool));
    }
  } catch (err) {
    console.error('Failed to save 4000 ID pool to localStorage', err);
  }
}

/**
 * Check if current user is allowed to create an account.
 * Rule: User cannot create two accounts at a time. Only ONE account per session/device.
 */
export function canCreateAccount(): { allowed: boolean; existingId?: string; reason?: string } {
  const currentId = getCurrentSessionId();
  if (!currentId) {
    return { allowed: true };
  }

  const pool = load4000Ids();
  const match = pool.find((item) => item.id === currentId);

  if (match && match.isIssued) {
    return {
      allowed: false,
      existingId: match.id,
      reason: 'Single Account Constraint: You already hold an active assigned credential ID.',
    };
  }

  return { allowed: true };
}

/**
 * Claims the next unissued ID for a user pressing "Create Account".
 * Enforces single account rule (no two accounts at a time).
 */
export function claimNextUnusedId(): { success: boolean; id?: PrecreatedId; error?: string } {
  // Check if session already holds an account
  const check = canCreateAccount();
  if (!check.allowed && check.existingId) {
    return {
      success: false,
      error: `You already hold Credential ID #${check.existingId}. Creating multiple simultaneous accounts is prohibited.`,
    };
  }

  const pool = load4000Ids();
  const index = pool.findIndex((item) => !item.isIssued);

  if (index === -1) {
    return {
      success: false,
      error: 'All 4,000 precreated IDs have been allocated. Please contact the Secretariat.',
    };
  }

  const now = new Date().toISOString();
  pool[index] = {
    ...pool[index],
    isIssued: true,
    issuedAt: now,
    isActivated: false, // Strictly restricted until Admin activates
    isExpired: false,
  };

  save4000Ids(pool);
  setCurrentSessionId(pool[index].id);
  return { success: true, id: pool[index] };
}

/**
 * Admin action: Elevate / Activate ID with 1-Year Subscription
 * Sets activatedAt to now, and expiresAt to exactly 1 year in the future.
 */
export function activateId(id: string): PrecreatedId[] {
  const pool = load4000Ids();
  const now = new Date();
  const expires = new Date(now.getTime() + ONE_YEAR_MS);

  const updated = pool.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        isActivated: true,
        isExpired: false,
        activatedAt: now.toISOString(),
        expiresAt: expires.toISOString(),
      };
    }
    return item;
  });
  save4000Ids(updated);
  return updated;
}

/**
 * Admin action: Renew Subscription (+1 Year)
 */
export function renewSubscription(id: string): PrecreatedId[] {
  const pool = load4000Ids();
  const now = new Date();
  const updated = pool.map((item) => {
    if (item.id === id) {
      // If currently active and in future, extend from future, else from now
      const currentExpiry = item.expiresAt ? new Date(item.expiresAt).getTime() : 0;
      const baseTime = currentExpiry > now.getTime() ? currentExpiry : now.getTime();
      const newExpiry = new Date(baseTime + ONE_YEAR_MS);

      return {
        ...item,
        isActivated: true,
        isExpired: false,
        activatedAt: item.activatedAt || now.toISOString(),
        expiresAt: newExpiry.toISOString(),
      };
    }
    return item;
  });
  save4000Ids(updated);
  return updated;
}

/**
 * Admin testing utility: Simulate Expiration of 1-Year Subscription
 * Immediately sets expiresAt to 1 second ago and deactivates the account.
 */
export function simulateExpiration(id: string): PrecreatedId[] {
  const pool = load4000Ids();
  const past = new Date(Date.now() - 5000); // 5 seconds ago

  const updated = pool.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        isActivated: false,
        isExpired: true,
        expiresAt: past.toISOString(),
      };
    }
    return item;
  });
  save4000Ids(updated);
  return updated;
}

/**
 * Admin action: Restrict / Deactivate ID (Manual Revoke)
 */
export function deactivateId(id: string): PrecreatedId[] {
  const pool = load4000Ids();
  const updated = pool.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        isActivated: false,
      };
    }
    return item;
  });
  save4000Ids(updated);
  return updated;
}

/**
 * Get the currently logged-in / active user's issued ID.
 */
export function getCurrentSessionId(): string | null {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem(CURRENT_SESSION_ID_KEY);
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Set the currently active session ID.
 */
export function setCurrentSessionId(id: string | null): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      if (id) {
        localStorage.setItem(CURRENT_SESSION_ID_KEY, id);
      } else {
        localStorage.removeItem(CURRENT_SESSION_ID_KEY);
      }
    }
  } catch (err) {
    console.error('Failed to set session ID', err);
  }
}

/**
 * Helper to check if a specific ID or current session ID is activated and unexpired.
 */
export function checkIsActivated(idOrCurrent?: string | null): boolean {
  const idToCheck = idOrCurrent || getCurrentSessionId();
  if (!idToCheck) return false;
  const pool = load4000Ids(); // Enforces auto-expiration check
  const found = pool.find((item) => item.id === idToCheck);
  return !!found?.isActivated && !found?.isExpired;
}

/**
 * Get human-readable subscription status and remaining days
 */
export function getSubscriptionInfo(idOrCurrent?: string | null): {
  isActivated: boolean;
  isExpired: boolean;
  expiresAt: string | null;
  daysRemaining: number | null;
  statusLabel: string;
} {
  const idToCheck = idOrCurrent || getCurrentSessionId();
  if (!idToCheck) {
    return {
      isActivated: false,
      isExpired: false,
      expiresAt: null,
      daysRemaining: null,
      statusLabel: 'No Credential Assigned',
    };
  }

  const pool = load4000Ids();
  const found = pool.find((item) => item.id === idToCheck);

  if (!found || !found.isIssued) {
    return {
      isActivated: false,
      isExpired: false,
      expiresAt: null,
      daysRemaining: null,
      statusLabel: 'Unassigned Pool Slot',
    };
  }

  if (found.isExpired) {
    return {
      isActivated: false,
      isExpired: true,
      expiresAt: found.expiresAt || null,
      daysRemaining: 0,
      statusLabel: 'Annual Subscription Expired (Auto-Deactivated)',
    };
  }

  if (!found.isActivated) {
    return {
      isActivated: false,
      isExpired: false,
      expiresAt: null,
      daysRemaining: null,
      statusLabel: 'Restricted (News Only • Awaiting Admin)',
    };
  }

  if (!found.expiresAt) {
    return {
      isActivated: true,
      isExpired: false,
      expiresAt: null,
      daysRemaining: 365,
      statusLabel: 'Active (1-Year Cycle)',
    };
  }

  const now = Date.now();
  const exp = new Date(found.expiresAt).getTime();
  const diffMs = exp - now;

  if (diffMs <= 0) {
    return {
      isActivated: false,
      isExpired: true,
      expiresAt: found.expiresAt,
      daysRemaining: 0,
      statusLabel: 'Annual Subscription Expired (Auto-Deactivated)',
    };
  }

  const daysRemaining = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
  return {
    isActivated: true,
    isExpired: false,
    expiresAt: found.expiresAt,
    daysRemaining,
    statusLabel: `Active (${daysRemaining} days remaining in 1-yr term)`,
  };
}
