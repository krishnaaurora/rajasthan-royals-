/**
 * Neon Platform Services (PostgreSQL, Auth, Object Storage) Client
 */

export interface NeonStatus {
  status: 'online' | 'degraded' | 'offline';
  neon_branch: string;
  neon_branch_id: string;
  postgres: {
    status: string;
    database: string;
    user: string;
    version: string;
    checks_recorded?: number;
  };
  auth: {
    status: string;
    base_url: string;
    jwks_url: string;
  };
  object_storage: {
    status: string;
    endpoint: string;
    region: string;
    buckets: string[];
  };
}

export async function fetchNeonStatus(): Promise<NeonStatus | null> {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/neon/status');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Failed to fetch Neon status from backend API:', error);
    return null;
  }
}
