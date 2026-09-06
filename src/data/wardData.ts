/**
 * AIGH — Ward Consumables Master Data File
 * Single authoritative source of truth for ward configuration,
 * par levels, nurse-on-shift, shift timings, and all 48 bay-consumable rows (8 bays x 6 consumables).
 */

import { ConsumableConfig, ConsumableId, WardConfig, ShiftCountRecord, StockMovementEvent } from '../types/ward';

export const STOCK_MOVEMENT_EVENTS: StockMovementEvent[] = [
  {
    id: 'event-1',
    shiftId: 'shift-1',
    bayId: 3,
    consumableId: 'gauze',
    type: 'restock',
    quantity: 10,
    timestamp: '06:15',
    notes: 'Pharmacy restock delivery of sterile gauze packs',
  },
  {
    id: 'event-2',
    shiftId: 'shift-2',
    bayId: 4,
    consumableId: 'cannulas',
    type: 'transfer',
    quantity: 2,
    timestamp: '14:30',
    notes: 'Inter-bay transfer of 2 cannula packs into Bay 4',
  },
];

// 6 historical shifts of timestamped counts across all bays and consumables
export const HISTORICAL_SHIFTS: ShiftCountRecord[] = [
  {
    shiftId: 'shift-6',
    shiftName: 'Day Shift (3 days ago)',
    timestamp: '2026-09-03 18:00',
    counts: {
      'bay1-gloves': 10, 'bay1-gauze': 12, 'bay1-saline': 20, 'bay1-cannulas': 15, 'bay1-dressings': 8, 'bay1-sharps': 4,
      'bay2-gloves': 6, 'bay2-gauze': 12, 'bay2-saline': 18, 'bay2-cannulas': 14, 'bay2-dressings': 7, 'bay2-sharps': 4,
      'bay3-gloves': 10, 'bay3-gauze': 12, 'bay3-saline': 19, 'bay3-cannulas': 14, 'bay3-dressings': 8, 'bay3-sharps': 4,
      'bay4-gloves': 9, 'bay4-gauze': 11, 'bay4-saline': 16, 'bay4-cannulas': 10, 'bay4-dressings': 7, 'bay4-sharps': 4,
      'bay5-gloves': 10, 'bay5-gauze': 12, 'bay5-saline': 20, 'bay5-cannulas': 15, 'bay5-dressings': 5, 'bay5-sharps': 4,
      'bay6-gloves': 10, 'bay6-gauze': 12, 'bay6-saline': 20, 'bay6-cannulas': 15, 'bay6-dressings': 8, 'bay6-sharps': 4,
      'bay7-gloves': 10, 'bay7-gauze': 12, 'bay7-saline': 8, 'bay7-cannulas': 13, 'bay7-dressings': 8, 'bay7-sharps': 4,
      'bay8-gloves': 9, 'bay8-gauze': 8, 'bay8-saline': 18, 'bay8-cannulas': 12, 'bay8-dressings': 7, 'bay8-sharps': 4,
    },
  },
  {
    shiftId: 'shift-5',
    shiftName: 'Night Shift (3 days ago)',
    timestamp: '2026-09-04 06:00',
    counts: {
      'bay1-gloves': 10, 'bay1-gauze': 12, 'bay1-saline': 19, 'bay1-cannulas': 14, 'bay1-dressings': 8, 'bay1-sharps': 4,
      'bay2-gloves': 5, 'bay2-gauze': 11, 'bay2-saline': 17, 'bay2-cannulas': 13, 'bay2-dressings': 7, 'bay2-sharps': 4,
      'bay3-gloves': 9, 'bay3-gauze': 6, 'bay3-saline': 18, 'bay3-cannulas': 13, 'bay3-dressings': 8, 'bay3-sharps': 3,
      'bay4-gloves': 9, 'bay4-gauze': 10, 'bay4-saline': 15, 'bay4-cannulas': 8, 'bay4-dressings': 6, 'bay4-sharps': 3,
      'bay5-gloves': 10, 'bay5-gauze': 12, 'bay5-saline': 19, 'bay5-cannulas': 15, 'bay5-dressings': 4, 'bay5-sharps': 4,
      'bay6-gloves': 10, 'bay6-gauze': 12, 'bay6-saline': 20, 'bay6-cannulas': 14, 'bay6-dressings': 7, 'bay6-sharps': 4,
      'bay7-gloves': 9, 'bay7-gauze': 11, 'bay7-saline': 7, 'bay7-cannulas': 12, 'bay7-dressings': 8, 'bay7-sharps': 3,
      'bay8-gloves': 8, 'bay8-gauze': 7, 'bay8-saline': 17, 'bay8-cannulas': 11, 'bay8-dressings': 6, 'bay8-sharps': 3,
    },
  },
  {
    shiftId: 'shift-4',
    shiftName: 'Day Shift (2 days ago)',
    timestamp: '2026-09-04 18:00',
    counts: {
      'bay1-gloves': 9, 'bay1-gauze': 11, 'bay1-saline': 19, 'bay1-cannulas': 14, 'bay1-dressings': 7, 'bay1-sharps': 4,
      'bay2-gloves': 4, 'bay2-gauze': 11, 'bay2-saline': 16, 'bay2-cannulas': 13, 'bay2-dressings': 7, 'bay2-sharps': 3,
      'bay3-gloves': 9, 'bay3-gauze': 12, 'bay3-saline': 18, 'bay3-cannulas': 13, 'bay3-dressings': 7, 'bay3-sharps': 3,
      'bay4-gloves': 8, 'bay4-gauze': 10, 'bay4-saline': 14, 'bay4-cannulas': 6, 'bay4-dressings': 6, 'bay4-sharps': 3,
      'bay5-gloves': 9, 'bay5-gauze': 11, 'bay5-saline': 18, 'bay5-cannulas': 14, 'bay5-dressings': 3, 'bay5-sharps': 4,
      'bay6-gloves': 10, 'bay6-gauze': 12, 'bay6-saline': 20, 'bay6-cannulas': 14, 'bay6-dressings': 7, 'bay6-sharps': 4,
      'bay7-gloves': 9, 'bay7-gauze': 11, 'bay7-saline': 6, 'bay7-cannulas': 12, 'bay7-dressings': 7, 'bay7-sharps': 3,
      'bay8-gloves': 8, 'bay8-gauze': 6, 'bay8-saline': 17, 'bay8-cannulas': 11, 'bay8-dressings': 6, 'bay8-sharps': 3,
    },
  },
  {
    shiftId: 'shift-3',
    shiftName: 'Night Shift (2 days ago)',
    timestamp: '2026-09-05 06:00',
    counts: {
      'bay1-gloves': 9, 'bay1-gauze': 11, 'bay1-saline': 18, 'bay1-cannulas': 13, 'bay1-dressings': 7, 'bay1-sharps': 4,
      'bay2-gloves': 3, 'bay2-gauze': 10, 'bay2-saline': 15, 'bay2-cannulas': 12, 'bay2-dressings': 6, 'bay2-sharps': 3,
      'bay3-gloves': 8, 'bay3-gauze': 11, 'bay3-saline': 17, 'bay3-cannulas': 12, 'bay3-dressings': 7, 'bay3-sharps': 3,
      'bay4-gloves': 8, 'bay4-gauze': 9, 'bay4-saline': 14, 'bay4-cannulas': 4, 'bay4-dressings': 5, 'bay4-sharps': 3,
      'bay5-gloves': 9, 'bay5-gauze': 11, 'bay5-saline': 18, 'bay5-cannulas': 14, 'bay5-dressings': 2, 'bay5-sharps': 4,
      'bay6-gloves': 10, 'bay6-gauze': 12, 'bay6-saline': 19, 'bay6-cannulas': 13, 'bay6-dressings': 6, 'bay6-sharps': 4,
      'bay7-gloves': 8, 'bay7-gauze': 10, 'bay7-saline': 5, 'bay7-cannulas': 11, 'bay7-dressings': 7, 'bay7-sharps': 3,
      'bay8-gloves': 7, 'bay8-gauze': 5, 'bay8-saline': 16, 'bay8-cannulas': 10, 'bay8-dressings': 5, 'bay8-sharps': 2,
    },
  },
  {
    shiftId: 'shift-2',
    shiftName: 'Day Shift (Yesterday)',
    timestamp: '2026-09-05 18:00',
    counts: {
      'bay1-gloves': 9, 'bay1-gauze': 11, 'bay1-saline': 18, 'bay1-cannulas': 13, 'bay1-dressings': 7, 'bay1-sharps': 4,
      'bay2-gloves': 3, 'bay2-gauze': 10, 'bay2-saline': 15, 'bay2-cannulas': 12, 'bay2-dressings': 6, 'bay2-sharps': 3,
      'bay3-gloves': 8, 'bay3-gauze': 6, 'bay3-saline': 17, 'bay3-cannulas': 12, 'bay3-dressings': 7, 'bay3-sharps': 2,
      'bay4-gloves': 7, 'bay4-gauze': 9, 'bay4-saline': 13, 'bay4-cannulas': 12, 'bay4-dressings': 5, 'bay4-sharps': 3,
      'bay5-gloves': 9, 'bay5-gauze': 11, 'bay5-saline': 17, 'bay5-cannulas': 14, 'bay5-dressings': 2, 'bay5-sharps': 4,
      'bay6-gloves': 10, 'bay6-gauze': 12, 'bay6-saline': 19, 'bay6-cannulas': 13, 'bay6-dressings': 6, 'bay6-sharps': 4,
      'bay7-gloves': 8, 'bay7-gauze': 10, 'bay7-saline': 4, 'bay7-cannulas': 11, 'bay7-dressings': 7, 'bay7-sharps': 3,
      'bay8-gloves': 7, 'bay8-gauze': 4, 'bay8-saline': 16, 'bay8-cannulas': 10, 'bay8-dressings': 5, 'bay8-sharps': 2,
    },
  },
  {
    shiftId: 'shift-1',
    shiftName: 'Night Shift (Yesterday)',
    timestamp: '2026-09-06 06:00',
    counts: {
      'bay1-gloves': 9, 'bay1-gauze': 11, 'bay1-saline': 18, 'bay1-cannulas': 13, 'bay1-dressings': 7, 'bay1-sharps': 4,
      'bay2-gloves': 2, 'bay2-gauze': 10, 'bay2-saline': 14, 'bay2-cannulas': 12, 'bay2-dressings': 6, 'bay2-sharps': 3,
      'bay3-gloves': 8, 'bay3-gauze': 12, 'bay3-saline': 16, 'bay3-cannulas': 11, 'bay3-dressings': 7, 'bay3-sharps': 2,
      'bay4-gloves': 7, 'bay4-gauze': 8, 'bay4-saline': 12, 'bay4-cannulas': 4, 'bay4-dressings': 5, 'bay4-sharps': 3,
      'bay5-gloves': 9, 'bay5-gauze': 11, 'bay5-saline': 17, 'bay5-cannulas': 14, 'bay5-dressings': 1, 'bay5-sharps': 4,
      'bay6-gloves': 10, 'bay6-gauze': 12, 'bay6-saline': 19, 'bay6-cannulas': 13, 'bay6-dressings': 6, 'bay6-sharps': 4,
      'bay7-gloves': 8, 'bay7-gauze': 10, 'bay7-saline': 4, 'bay7-cannulas': 10, 'bay7-dressings': 7, 'bay7-sharps': 3,
      'bay8-gloves': 6, 'bay8-gauze': 4, 'bay8-saline': 15, 'bay8-cannulas': 9, 'bay8-dressings': 5, 'bay8-sharps': 2,
    },
  },
];

export const CONSUMABLE_CONFIGS: Record<ConsumableId, ConsumableConfig> = {
  gloves: {
    id: 'gloves',
    name: 'Gloves',
    unit: 'boxes (100ct)',
    parLevel: 10,
    description: 'Nitrile examination gloves (M/L)',
  },
  gauze: {
    id: 'gauze',
    name: 'Gauze',
    unit: 'sterile packs',
    parLevel: 12,
    description: '7.5cm x 7.5cm sterile gauze swab packs',
  },
  saline: {
    id: 'saline',
    name: 'Saline flushes',
    unit: 'pre-filled 10ml',
    parLevel: 20,
    description: '0.9% Sodium Chloride IV flush syringes',
  },
  cannulas: {
    id: 'cannulas',
    name: 'Cannulas',
    unit: 'IV units (20G/22G)',
    parLevel: 15,
    description: 'Peripheral intravenous catheter packs',
  },
  dressings: {
    id: 'dressings',
    name: 'Dressing packs',
    unit: 'standard packs',
    parLevel: 8,
    description: 'Standard aseptic wound dressing kits',
  },
  sharps: {
    id: 'sharps',
    name: 'Sharps bins',
    unit: '1L containers',
    parLevel: 4,
    description: 'Yellow clinical sharps disposal containers',
  },
};

export const WARD_CONFIG: WardConfig = {
  wardName: 'St. Jude Inpatient Ward 4B — Acute Adult Care',
  currentShift: 'Day Shift (07:00 – 19:30)',
  nextShift: 'Night Shift (19:30 – 07:30)',
  nurseOnShift: 'Staff Nurse Elena Rostova, RN',
  nurseBadge: 'Badge #4821',
  shiftDate: 'Today (In Progress)',
  parLevels: {
    gloves: 10,
    gauze: 12,
    saline: 20,
    cannulas: 15,
    dressings: 8,
    sharps: 4,
  },
  // Initial bay status across the 8 bays
  initialBays: [
    { id: 1, name: 'Bay 1 (Beds 1–4)', isCounted: true, lastCountedAt: '17:45' },
    { id: 2, name: 'Bay 2 (Beds 5–8)', isCounted: true, lastCountedAt: '17:58' },
    { id: 3, name: 'Bay 3 (Beds 9–12)', isCounted: true, lastCountedAt: '18:10' },
    { id: 4, name: 'Bay 4 (Beds 13–16)', isCounted: false, lastCountedAt: null },
    { id: 5, name: 'Bay 5 (Beds 17–20)', isCounted: true, lastCountedAt: '18:25' },
    { id: 6, name: 'Bay 6 (Beds 21–24)', isCounted: true, lastCountedAt: '18:32' },
    { id: 7, name: 'Bay 7 (Beds 25–28)', isCounted: true, lastCountedAt: '18:40' },
    { id: 8, name: 'Bay 8 (Beds 29–32)', isCounted: false, lastCountedAt: null },
  ],
  // 48 rows: Exactly 8 bays x 6 consumables
  initialStockItems: [
    // Bay 1 (Beds 1-4) - Counted
    { id: 'bay1-gloves', bayId: 1, bayName: 'Bay 1', consumableId: 'gloves', consumableName: 'Gloves', unit: 'boxes', parLevel: 10, count: 9 },
    { id: 'bay1-gauze', bayId: 1, bayName: 'Bay 1', consumableId: 'gauze', consumableName: 'Gauze', unit: 'packs', parLevel: 12, count: 11 },
    { id: 'bay1-saline', bayId: 1, bayName: 'Bay 1', consumableId: 'saline', consumableName: 'Saline flushes', unit: 'units', parLevel: 20, count: 18 },
    { id: 'bay1-cannulas', bayId: 1, bayName: 'Bay 1', consumableId: 'cannulas', consumableName: 'Cannulas', unit: 'units', parLevel: 15, count: 13 },
    { id: 'bay1-dressings', bayId: 1, bayName: 'Bay 1', consumableId: 'dressings', consumableName: 'Dressing packs', unit: 'packs', parLevel: 8, count: 7 },
    { id: 'bay1-sharps', bayId: 1, bayName: 'Bay 1', consumableId: 'sharps', consumableName: 'Sharps bins', unit: 'units', parLevel: 4, count: 4 },

    // Bay 2 (Beds 5-8) - Counted - Notable shortage in gloves
    { id: 'bay2-gloves', bayId: 2, bayName: 'Bay 2', consumableId: 'gloves', consumableName: 'Gloves', unit: 'boxes', parLevel: 10, count: 2 },
    { id: 'bay2-gauze', bayId: 2, bayName: 'Bay 2', consumableId: 'gauze', consumableName: 'Gauze', unit: 'packs', parLevel: 12, count: 10 },
    { id: 'bay2-saline', bayId: 2, bayName: 'Bay 2', consumableId: 'saline', consumableName: 'Saline flushes', unit: 'units', parLevel: 20, count: 14 },
    { id: 'bay2-cannulas', bayId: 2, bayName: 'Bay 2', consumableId: 'cannulas', consumableName: 'Cannulas', unit: 'units', parLevel: 15, count: 12 },
    { id: 'bay2-dressings', bayId: 2, bayName: 'Bay 2', consumableId: 'dressings', consumableName: 'Dressing packs', unit: 'packs', parLevel: 8, count: 6 },
    { id: 'bay2-sharps', bayId: 2, bayName: 'Bay 2', consumableId: 'sharps', consumableName: 'Sharps bins', unit: 'units', parLevel: 4, count: 3 },

    // Bay 3 (Beds 9-12) - Counted
    { id: 'bay3-gloves', bayId: 3, bayName: 'Bay 3', consumableId: 'gloves', consumableName: 'Gloves', unit: 'boxes', parLevel: 10, count: 8 },
    { id: 'bay3-gauze', bayId: 3, bayName: 'Bay 3', consumableId: 'gauze', consumableName: 'Gauze', unit: 'packs', parLevel: 12, count: 6 },
    { id: 'bay3-saline', bayId: 3, bayName: 'Bay 3', consumableId: 'saline', consumableName: 'Saline flushes', unit: 'units', parLevel: 20, count: 16 },
    { id: 'bay3-cannulas', bayId: 3, bayName: 'Bay 3', consumableId: 'cannulas', consumableName: 'Cannulas', unit: 'units', parLevel: 15, count: 11 },
    { id: 'bay3-dressings', bayId: 3, bayName: 'Bay 3', consumableId: 'dressings', consumableName: 'Dressing packs', unit: 'packs', parLevel: 8, count: 7 },
    { id: 'bay3-sharps', bayId: 3, bayName: 'Bay 3', consumableId: 'sharps', consumableName: 'Sharps bins', unit: 'units', parLevel: 4, count: 2 },

    // Bay 4 (Beds 13-16) - Pending count - Critical shortage in cannulas (par 15, count 2 -> deficit 13)
    { id: 'bay4-gloves', bayId: 4, bayName: 'Bay 4', consumableId: 'gloves', consumableName: 'Gloves', unit: 'boxes', parLevel: 10, count: 7 },
    { id: 'bay4-gauze', bayId: 4, bayName: 'Bay 4', consumableId: 'gauze', consumableName: 'Gauze', unit: 'packs', parLevel: 12, count: 8 },
    { id: 'bay4-saline', bayId: 4, bayName: 'Bay 4', consumableId: 'saline', consumableName: 'Saline flushes', unit: 'units', parLevel: 20, count: 12 },
    { id: 'bay4-cannulas', bayId: 4, bayName: 'Bay 4', consumableId: 'cannulas', consumableName: 'Cannulas', unit: 'units', parLevel: 15, count: 2 },
    { id: 'bay4-dressings', bayId: 4, bayName: 'Bay 4', consumableId: 'dressings', consumableName: 'Dressing packs', unit: 'packs', parLevel: 8, count: 5 },
    { id: 'bay4-sharps', bayId: 4, bayName: 'Bay 4', consumableId: 'sharps', consumableName: 'Sharps bins', unit: 'units', parLevel: 4, count: 3 },

    // Bay 5 (Beds 17-20) - Counted - Notable shortage in dressings
    { id: 'bay5-gloves', bayId: 5, bayName: 'Bay 5', consumableId: 'gloves', consumableName: 'Gloves', unit: 'boxes', parLevel: 10, count: 9 },
    { id: 'bay5-gauze', bayId: 5, bayName: 'Bay 5', consumableId: 'gauze', consumableName: 'Gauze', unit: 'packs', parLevel: 12, count: 11 },
    { id: 'bay5-saline', bayId: 5, bayName: 'Bay 5', consumableId: 'saline', consumableName: 'Saline flushes', unit: 'units', parLevel: 20, count: 17 },
    { id: 'bay5-cannulas', bayId: 5, bayName: 'Bay 5', consumableId: 'cannulas', consumableName: 'Cannulas', unit: 'units', parLevel: 15, count: 14 },
    { id: 'bay5-dressings', bayId: 5, bayName: 'Bay 5', consumableId: 'dressings', consumableName: 'Dressing packs', unit: 'packs', parLevel: 8, count: 1 },
    { id: 'bay5-sharps', bayId: 5, bayName: 'Bay 5', consumableId: 'sharps', consumableName: 'Sharps bins', unit: 'units', parLevel: 4, count: 4 },

    // Bay 6 (Beds 21-24) - Counted
    { id: 'bay6-gloves', bayId: 6, bayName: 'Bay 6', consumableId: 'gloves', consumableName: 'Gloves', unit: 'boxes', parLevel: 10, count: 10 },
    { id: 'bay6-gauze', bayId: 6, bayName: 'Bay 6', consumableId: 'gauze', consumableName: 'Gauze', unit: 'packs', parLevel: 12, count: 12 },
    { id: 'bay6-saline', bayId: 6, bayName: 'Bay 6', consumableId: 'saline', consumableName: 'Saline flushes', unit: 'units', parLevel: 20, count: 19 },
    { id: 'bay6-cannulas', bayId: 6, bayName: 'Bay 6', consumableId: 'cannulas', consumableName: 'Cannulas', unit: 'units', parLevel: 15, count: 13 },
    { id: 'bay6-dressings', bayId: 6, bayName: 'Bay 6', consumableId: 'dressings', consumableName: 'Dressing packs', unit: 'packs', parLevel: 8, count: 6 },
    { id: 'bay6-sharps', bayId: 6, bayName: 'Bay 6', consumableId: 'sharps', consumableName: 'Sharps bins', unit: 'units', parLevel: 4, count: 4 },

    // Bay 7 (Beds 25-28) - Counted - Major shortage in Saline flushes (par 20, count 3 -> deficit 17)
    { id: 'bay7-gloves', bayId: 7, bayName: 'Bay 7', consumableId: 'gloves', consumableName: 'Gloves', unit: 'boxes', parLevel: 10, count: 8 },
    { id: 'bay7-gauze', bayId: 7, bayName: 'Bay 7', consumableId: 'gauze', consumableName: 'Gauze', unit: 'packs', parLevel: 12, count: 10 },
    { id: 'bay7-saline', bayId: 7, bayName: 'Bay 7', consumableId: 'saline', consumableName: 'Saline flushes', unit: 'units', parLevel: 20, count: 3 },
    { id: 'bay7-cannulas', bayId: 7, bayName: 'Bay 7', consumableId: 'cannulas', consumableName: 'Cannulas', unit: 'units', parLevel: 15, count: 10 },
    { id: 'bay7-dressings', bayId: 7, bayName: 'Bay 7', consumableId: 'dressings', consumableName: 'Dressing packs', unit: 'packs', parLevel: 8, count: 7 },
    { id: 'bay7-sharps', bayId: 7, bayName: 'Bay 7', consumableId: 'sharps', consumableName: 'Sharps bins', unit: 'units', parLevel: 4, count: 3 },

    // Bay 8 (Beds 29-32) - Pending count - Shortage in gauze (par 12, count 3 -> deficit 9)
    { id: 'bay8-gloves', bayId: 8, bayName: 'Bay 8', consumableId: 'gloves', consumableName: 'Gloves', unit: 'boxes', parLevel: 10, count: 6 },
    { id: 'bay8-gauze', bayId: 8, bayName: 'Bay 8', consumableId: 'gauze', consumableName: 'Gauze', unit: 'packs', parLevel: 12, count: 3 },
    { id: 'bay8-saline', bayId: 8, bayName: 'Bay 8', consumableId: 'saline', consumableName: 'Saline flushes', unit: 'units', parLevel: 20, count: 15 },
    { id: 'bay8-cannulas', bayId: 8, bayName: 'Bay 8', consumableId: 'cannulas', consumableName: 'Cannulas', unit: 'units', parLevel: 15, count: 9 },
    { id: 'bay8-dressings', bayId: 8, bayName: 'Bay 8', consumableId: 'dressings', consumableName: 'Dressing packs', unit: 'packs', parLevel: 8, count: 5 },
    { id: 'bay8-sharps', bayId: 8, bayName: 'Bay 8', consumableId: 'sharps', consumableName: 'Sharps bins', unit: 'units', parLevel: 4, count: 2 },
  ],
  historicalShifts: HISTORICAL_SHIFTS,
  stockMovementEvents: STOCK_MOVEMENT_EVENTS,
};
