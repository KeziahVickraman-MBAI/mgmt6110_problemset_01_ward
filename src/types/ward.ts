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
}

export type ScreenTab = 'round' | 'lowest' | 'handover';
