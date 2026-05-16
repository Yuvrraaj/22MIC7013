export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Maintenance {
  id: string;
  vehicleId: string;
  type: MaintenanceType;
  desc: string;
  scheduledAt: Date;
  completedAt: Date | null;
  cost: number | null;
  notes: string;
  status: MaintenanceStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type MaintenanceType =
  | 'oil_change'
  | 'tire_rotation'
  | 'brake_inspection'
  | 'engine_tune'
  | 'transmission'
  | 'battery'
  | 'other';

export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface CreateVehicleDto {
  make: string;
  model: string;
  year: number;
  plate: string;
  ownerId: string;
}

export interface UpdateVehicleDto {
  make?: string;
  model?: string;
  year?: number;
  plate?: string;
}

export interface CreateMaintenanceDto {
  vehicleId: string;
  type: MaintenanceType;
  desc: string;
  scheduledAt: string;
  notes?: string;
}

export interface UpdateMaintenanceDto {
  type?: MaintenanceType;
  desc?: string;
  scheduledAt?: string;
  completedAt?: string;
  cost?: number;
  notes?: string;
  status?: MaintenanceStatus;
}
