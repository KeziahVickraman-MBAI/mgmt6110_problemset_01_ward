import React, { useState } from 'react';
import { BayStatus, BayStockItem } from '../types/ward';
import { CheckCircle2, AlertCircle, ChevronDown, ChevronUp, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';

interface TheRoundProps {
  bays: BayStatus[];
  stockItems: BayStockItem[];
  onUpdateCount: (bayId: number, consumableId: string, delta: number) => void;
  onSetBayCounted: (bayId: number) => void;
  onProceedToLowest: () => void;
  onMarkAllCountedForDemo?: () => void;
  onResetCounts?: () => void;
}

export const TheRound: React.FC<TheRoundProps> = ({
  bays,
  stockItems,
  onUpdateCount,
  onSetBayCounted,
  onProceedToLowest,
  onMarkAllCountedForDemo,
  onResetCounts,
}) => {
  // Find first uncounted bay or default to bay 4 (pending)
  const initialOpenBay = bays.find((b) => !b.isCounted)?.id || 1;
  const [activeBayId, setActiveBayId] = useState<number | null>(initialOpenBay);

  const countedCount = bays.filter((b) => b.isCounted).length;
  const allCounted = countedCount === bays.length;

  const handleToggleBay = (bayId: number) => {
    setActiveBayId(activeBayId === bayId ? null : bayId);
  };

  const handleNextBay = (currentBayId: number) => {
    // Mark current bay as counted if not already
    onSetBayCounted(currentBayId);

    // Look for next uncounted bay
    const nextUncounted = bays.find((b) => b.id > currentBayId && !b.isCounted);
    if (nextUncounted) {
      setActiveBayId(nextUncounted.id);
    } else {
      // Or simply next bay in order (1 to 8)
      const nextId = currentBayId < 8 ? currentBayId + 1 : 1;
      setActiveBayId(nextId);
    }
  };

  return (
    <div className="space-y-4 pb-20 max-w-3xl mx-auto px-3 sm:px-4 pt-3">
      {/* Screen Title & Role Notice */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span>The Round</span>
            <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
              Ward Stock Count
            </span>
          </h2>
          <p className="text-xs text-slate-600">
            Tap a bay to count consumables using steppers. No typing required.
          </p>
        </div>

        {/* Demo count helper */}
        <div className="flex items-center gap-1">
          {onResetCounts && (
            <button
              onClick={onResetCounts}
              title="Reset to original test state"
              className="text-xs text-slate-500 hover:text-slate-700 p-1.5 rounded hover:bg-slate-200 flex items-center gap-1"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Ward Status Completion Card */}
      {allCounted ? (
        <div
          id="ward-complete-banner"
          className="bg-green-50 border border-green-300 rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
              ✓
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-green-900 text-base">Ward is Done</h3>
                <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                  8/8 Completed
                </span>
              </div>
              <p className="text-xs text-green-800 mt-1 leading-relaxed">
                Every bay has been counted this shift. Nothing is red or outstanding. You can now proceed to review the lowest-stocked items for handover.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  id="btn-proceed-to-lowest"
                  onClick={onProceedToLowest}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow transition-transform active:scale-95"
                >
                  <span>Review The Two Lowest</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          id="ward-progress-banner"
          className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {countedCount}/8
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  {countedCount} of {bays.length} Bays Completed
                </h3>
                <p className="text-xs text-slate-500">
                  {bays.length - countedCount} bay{bays.length - countedCount > 1 ? 's' : ''} pending count before handover.
                </p>
              </div>
            </div>

            {onMarkAllCountedForDemo && (
              <button
                onClick={onMarkAllCountedForDemo}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-2 py-1 rounded hover:bg-blue-50 shrink-0"
              >
                Mark all counted
              </button>
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-green-500 h-full transition-all duration-300"
              style={{ width: `${(countedCount / bays.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* 8 Bays List */}
      <div className="space-y-2.5">
        {bays.map((bay) => {
          const isOpen = activeBayId === bay.id;
          const bayStock = stockItems.filter((item) => item.bayId === bay.id);
          const hasShortage = bayStock.some((item) => item.count < item.parLevel * 0.4);

          return (
            <div
              key={bay.id}
              id={`bay-card-${bay.id}`}
              className={`rounded-xl border transition-all duration-200 bg-white shadow-sm overflow-hidden ${
                isOpen
                  ? 'border-blue-400 bg-blue-50/20 ring-2 ring-blue-100'
                  : bay.isCounted
                  ? 'border-green-200 bg-green-50/40 hover:border-green-300'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Bay Accordion Header - Big Touch Target */}
              <button
                type="button"
                id={`toggle-bay-${bay.id}`}
                onClick={() => handleToggleBay(bay.id)}
                className="w-full text-left p-3 sm:p-3.5 flex items-center justify-between gap-2 focus:outline-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                      isOpen
                        ? 'bg-blue-600 text-white'
                        : bay.isCounted
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {bay.id}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm font-bold truncate ${isOpen ? 'text-blue-900' : 'text-slate-800'}`}>
                        {bay.name}
                      </h3>
                      {hasShortage && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-100 text-red-700 font-bold uppercase tracking-tight shrink-0">
                          Low Stock
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">6 consumables configured</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {bay.isCounted ? (
                    <span className="inline-flex items-center gap-1 text-[11px] uppercase text-green-600 font-bold bg-green-100/80 px-2 py-0.5 rounded">
                      <span>✓ Counted</span>
                      {bay.lastCountedAt && (
                        <span className="text-green-700 font-normal lowercase">({bay.lastCountedAt})</span>
                      )}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] uppercase text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">
                      <AlertCircle className="h-3 w-3 text-amber-500" />
                      <span>Pending</span>
                    </span>
                  )}
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Bay Expanded Content: 6 Consumables Steppers */}
              {isOpen && (
                <div className="border-t border-slate-100 bg-white p-3 sm:p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1 uppercase tracking-wider">
                    <span>Item &amp; Par Level</span>
                    <span>Handheld Stepper</span>
                  </div>

                  {/* Consumable Rows */}
                  <div className="space-y-2">
                    {bayStock.map((item) => {
                      const deficit = item.parLevel - item.count;
                      const isCritical = item.count <= Math.floor(item.parLevel * 0.35);

                      return (
                        <div
                          key={item.id}
                          id={`row-${item.id}`}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                            isCritical
                              ? 'bg-red-50 border-red-200'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          {/* Item Info */}
                          <div className="min-w-0 pr-2">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`text-xs font-bold uppercase tracking-tight ${
                                  isCritical ? 'text-red-700' : 'text-slate-700'
                                }`}
                              >
                                {item.consumableName}
                              </span>
                              {isCritical && (
                                <span className="text-[9px] px-1 py-0.2 rounded font-bold bg-red-200 text-red-800 uppercase">
                                  Critical
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">
                              <span>Par: {item.parLevel} {item.unit.split(' ')[0]}</span>
                              {deficit > 0 ? (
                                <span className={isCritical ? 'text-red-600 ml-2 font-medium' : 'text-slate-600 ml-2'}>
                                  (–{deficit} short)
                                </span>
                              ) : (
                                <span className="text-green-600 ml-2 font-medium">✓ at par</span>
                              )}
                            </div>
                          </div>

                          {/* Stepper Controls */}
                          <div className="flex items-center gap-2 shrink-0">
                            {/* Decrement Button */}
                            <button
                              type="button"
                              id={`btn-dec-${item.id}`}
                              disabled={item.count <= 0}
                              onClick={() => onUpdateCount(item.bayId, item.consumableId, -1)}
                              aria-label={`Decrease ${item.consumableName} count`}
                              className={`w-11 h-11 sm:w-12 sm:h-12 rounded bg-white border shadow-xs flex items-center justify-center text-xl font-bold active:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-transform active:scale-95 ${
                                isCritical ? 'border-red-300 text-red-800' : 'border-slate-300 text-slate-800'
                              }`}
                            >
                              −
                            </button>

                            {/* Large Readable Count Display */}
                            <span
                              className={`text-2xl font-mono font-bold w-12 sm:w-14 text-center ${
                                isCritical ? 'text-red-600' : 'text-slate-900'
                              }`}
                            >
                              {item.count < 10 ? `0${item.count}` : item.count}
                            </span>

                            {/* Increment Button */}
                            <button
                              type="button"
                              id={`btn-inc-${item.id}`}
                              onClick={() => onUpdateCount(item.bayId, item.consumableId, 1)}
                              aria-label={`Increase ${item.consumableName} count`}
                              className={`w-11 h-11 sm:w-12 sm:h-12 rounded text-white flex items-center justify-center text-xl font-bold shadow-xs transition-transform active:scale-95 ${
                                isCritical
                                  ? 'bg-red-600 active:bg-red-700'
                                  : 'bg-blue-600 active:bg-blue-700'
                              }`}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bay Bottom Actions: Save Bay & Next Bay */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 border-t border-slate-100 mt-2">
                    <button
                      type="button"
                      id={`btn-mark-counted-${bay.id}`}
                      onClick={() => onSetBayCounted(bay.id)}
                      className="w-full sm:flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2 text-sm uppercase tracking-tight"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>SAVE {bay.name.toUpperCase()} &amp; CONFIRM</span>
                    </button>

                    <button
                      type="button"
                      id={`btn-next-bay-${bay.id}`}
                      onClick={() => handleNextBay(bay.id)}
                      className="py-3 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform border border-slate-200"
                    >
                      <span>Next Bay</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
