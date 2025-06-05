export type DayOfWeek = 'Lun' | 'Mar' | 'Mer' | 'Gio' | 'Ven' | 'Sab' | 'Dom';

export interface StatsResult {
  averageOccupancy: Record<DayOfWeek, Record<string, number>>;
  maxOccupancy: number;
  minOccupancy: number;
  revenue: number;
  rejectedCount: number;
  mostRequestedSlot: string;
}