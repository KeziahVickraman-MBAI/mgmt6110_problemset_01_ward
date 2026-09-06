/**
 * AIGH — Ward Consumables Burn Rate Capability
 * 
 * Rules & Requirements:
 * - Uses stored count history across consecutive shifts to turn a flag from a status
 *   into a warning ("Bay 3, gauze, 6 left, about a shift's worth").
 * - Stays OFF until 6 shifts of history exist.
 * - Output is coarse ("about a shift's worth", "2–3 shifts"), never a decimal.
 * - Any non-consumption stock movement (restock, bay transfer) is recorded as an event
 *   and excluded from consumption calculations.
 * - Reorders Screen 2 candidates so the two lowest become the two closest to running out.
 */

import { ConsumableId, ShiftCountRecord, StockMovementEvent, BurnRateResult } from '../types/ward';

/**
 * Maps numeric estimated shifts remaining to clinical coarse phrasing.
 * Coarse output avoids false precision in a high-variability clinical ward setting.
 */
export function formatCoarseShifts(shiftsRemaining: number): string {
  if (shiftsRemaining <= 0) {
    return "critical: depleted";
  }
  if (shiftsRemaining <= 1.25) {
    return "about a shift's worth";
  }
  if (shiftsRemaining <= 2.25) {
    return "1–2 shifts";
  }
  if (shiftsRemaining <= 3.25) {
    return "2–3 shifts";
  }
  if (shiftsRemaining <= 4.25) {
    return "3–4 shifts";
  }
  if (shiftsRemaining <= 5.25) {
    return "4–5 shifts";
  }
  return "5+ shifts";
}

/**
 * Calculates burn rate and runout risk for a specific bay and consumable item.
 * Returns null if fewer than 6 shifts of history exist.
 */
export function calculateBurnRate(
  bayId: number,
  bayName: string,
  consumableId: ConsumableId,
  consumableName: string,
  currentCount: number,
  historicalShifts: ShiftCountRecord[],
  movementEvents: StockMovementEvent[]
): BurnRateResult | null {
  // Rule: Stays off until 6 shifts of history exist. Before that, flags read as they do in v1.
  if (!historicalShifts || historicalShifts.length < 6) {
    return null;
  }

  // Create ordered timeline of counts: historical shifts (up to last 6) plus current count
  const itemKey = `bay${bayId}-${consumableId}`;
  
  // Look at last 5 to 6 shifts
  const recentShifts = historicalShifts.slice(-6);

  // Extract count series
  const countSeries: { shiftId: string; count: number }[] = recentShifts.map((shift) => ({
    shiftId: shift.shiftId,
    count: shift.counts[itemKey] ?? currentCount,
  }));

  // Append current shift count
  countSeries.push({
    shiftId: 'current',
    count: currentCount,
  });

  // Calculate consecutive differences, excluding any shift where a restock or transfer event occurred
  const validDeltas: number[] = [];

  for (let i = 1; i < countSeries.length; i++) {
    const prev = countSeries[i - 1];
    const curr = countSeries[i];

    // Check if any non-consumption stock movement event occurred for this bay & consumable in this shift
    const hasMovementEvent = movementEvents.some(
      (ev) =>
        ev.bayId === bayId &&
        ev.consumableId === consumableId &&
        (ev.shiftId === curr.shiftId || ev.shiftId === prev.shiftId)
    );

    if (hasMovementEvent) {
      // Exclude interval: restock or transfer would distort burn rate
      continue;
    }

    const consumptionDelta = prev.count - curr.count;
    // Only count positive consumption (usage)
    if (consumptionDelta > 0) {
      validDeltas.push(consumptionDelta);
    }
  }

  // If no valid consumption intervals found, we cannot reliably compute burn rate
  if (validDeltas.length === 0) {
    return null;
  }

  const totalConsumption = validDeltas.reduce((acc, d) => acc + d, 0);
  const averageBurnRate = totalConsumption / validDeltas.length;

  if (averageBurnRate <= 0) {
    return null;
  }

  // Estimated shifts until runout
  const estimatedShiftsRemaining = currentCount / averageBurnRate;
  const coarseText = formatCoarseShifts(estimatedShiftsRemaining);
  const warningText = `${bayName}, ${consumableName.toLowerCase()}, ${currentCount} left, ${coarseText}`;

  return {
    burnRate: averageBurnRate,
    estimatedShiftsRemaining,
    coarseText,
    warningText,
  };
}
