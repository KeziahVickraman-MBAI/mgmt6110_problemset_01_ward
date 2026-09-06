export type ConsumableId =
  | 'gloves'
  | 'gauze'
  | 'saline'
  | 'cannulas'
  | 'dressings'
  | 'sharps';

export interface ConsumableConfig {
  id: ConsumableId;
  name: string;
  unit: string;
  parLevel: number;
  description: string;
}

export interface BayStockItem {
  id: string; // e.g. "bay1-gloves"
  bayId: number; // 1 to 8
  bayName: string; // e.g. "Bay 1"
  consumableId: ConsumableId;
  consumableName: string;
  unit: string;
  parLevel: number;
  count: number;
}

export interface BayStatus {
  id: number;
  name: string;
  isCounted: boolean;
  lastCountedAt: string | null;
}

export interface StockMovementEvent {
  id: string;
  shiftId: string;
  bayId: number;
  consumableId: ConsumableId;
  type: 'restock' | 'transfer';
  quantity: number; // e.g. +10 or -2
  timestamp: string;
  notes?: string;
}

export interface ShiftCountRecord {
  shiftId: string;
  shiftName: string;
  timestamp: string;
  counts: Record<string, number>; // key: `${bayId}-${consumableId}` -> count
}

export interface BurnRateResult {
  burnRate: number; // average consumption per shift
  estimatedShiftsRemaining: number;
  coarseText: string; // e.g. "about a shift's worth", "2–3 shifts"
  warningText: string; // e.g. "Bay 3, gauze, 6 left, about a shift's worth"
  exclusionNote: string | null; // e.g. "excludes restock 06:15"
}

export interface WardConfig {
  wardName: string;
  currentShift: string;
  nextShift: string;
  nurseOnShift: string;
  nurseBadge: string;
  shiftDate: string;
  parLevels: Record<ConsumableId, number>;
  initialStockItems: BayStockItem[];
  initialBays: BayStatus[];
  historicalShifts: ShiftCountRecord[];
  stockMovementEvents: StockMovementEvent[];
}

export interface HandoverFlag {
  id: string; // bayId-consumableId
  bayId: number;
  bayName: string;
  consumableId: ConsumableId;
  consumableName: string;
  unit: string;
  count: number;
  par: number;
  deficit: number; // par - count
  deficitPercentage: number;
  note: string;
  nurseName: string;
  countedAt: string;
  targetShift: string;
  burnRateWarning?: string | null;
  estimatedShiftsRemaining?: number | null;
  burnRateExclusion?: string | null;
}

export type ScreenTab = 'round' | 'lowest' | 'handover';
export type ViewMode = 'phone' | 'web';
