export type IncidentType = 'Harassment' | 'Unsafe Area' | 'Threat' | 'Stalking' | 'Other';

export type ReportStatus = 'Submitted' | 'Under Review' | 'Resolved';

export type AlertStatus = 'Active' | 'Resolved' | 'Cancelled';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  emergency_preference?: string;
  created_at: string;
}

export interface EmergencyContact {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  relationship: string;
  created_at: string;
}

export interface SosAlert {
  id: string;
  user_id: string;
  latitude: number | null;
  longitude: number | null;
  accuracy?: number | null;
  status: AlertStatus;
  created_at: string;
  resolved_at?: string;
  note?: string;
}

export interface IncidentReport {
  id: string;
  user_id: string;
  incident_type: IncidentType;
  description: string;
  location: string;
  incident_date: string;
  status: ReportStatus;
  image_url?: string;
  created_at: string;
}

export interface LocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  timestamp: number | null;
  status: 'idle' | 'locating' | 'success' | 'error';
  errorMessage?: string;
}
