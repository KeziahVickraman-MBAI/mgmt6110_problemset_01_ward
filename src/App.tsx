import { useState, useMemo } from 'react';
import { WARD_CONFIG } from './data/wardData';
import { BayStatus, BayStockItem, HandoverFlag, ScreenTab, ViewMode } from './types/ward';
import { WardHeader } from './components/WardHeader';
import { TheRound } from './components/TheRound';
import { TheTwoLowest } from './components/TheTwoLowest';
import { Handover } from './components/Handover';
import { calculateBurnRate } from './utils/burnRate';

export default function App() {
  const [activeTab, setActiveTab] = useState<ScreenTab>('round');
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      return 'web';
    }
    return 'phone';
  });

  // Master ward state initialized from the single authoritative data file
  const [bays, setBays] = useState<BayStatus[]>(WARD_CONFIG.initialBays);
  const [stockItems, setStockItems] = useState<BayStockItem[]>(WARD_CONFIG.initialStockItems);

  // Initial confirmed flags automatically derived from the top two runout risks or deficits
  const initialDefaultFlags = useMemo<HandoverFlag[]>(() => {
    const historicalShifts = WARD_CONFIG.historicalShifts || [];
    const stockMovementEvents = WARD_CONFIG.stockMovementEvents || [];
    const burnRateActive = historicalShifts.length >= 6;

    const enriched = WARD_CONFIG.initialStockItems.map((item) => {
      const deficit = item.parLevel - item.count;
      const deficitPercentage = Math.round((deficit / item.parLevel) * 100);
      const burnRateData = calculateBurnRate(
        item.bayId,
        item.bayName,
        item.consumableId,
        item.consumableName,
        item.count,
        historicalShifts,
        stockMovementEvents
      );

      return {
        ...item,
        deficit,
        deficitPercentage,
        burnRateWarning: burnRateData?.warningText || null,
        estimatedShiftsRemaining: burnRateData?.estimatedShiftsRemaining ?? null,
        burnRateExclusion: burnRateData?.exclusionNote ?? null,
      };
    });

    const sorted = [...enriched].sort((a, b) => {
      if (burnRateActive) {
        const aShifts = a.estimatedShiftsRemaining;
        const bShifts = b.estimatedShiftsRemaining;
        if (aShifts !== null && bShifts !== null) {
          if (Math.abs(aShifts - bShifts) > 0.001) {
            return aShifts - bShifts;
          }
        } else if (aShifts !== null) {
          return -1;
        } else if (bShifts !== null) {
          return 1;
        }
      }
      return b.deficit - a.deficit || a.count - b.count;
    });

    const top2 = sorted.slice(0, 2);
    const timeNow = '18:45';

    return top2.map((item) => ({
      id: item.id,
      bayId: item.bayId,
      bayName: item.bayName,
      consumableId: item.consumableId,
      consumableName: item.consumableName,
      unit: item.unit,
      count: item.count,
      par: item.parLevel,
      deficit: item.deficit,
      deficitPercentage: item.deficitPercentage,
      note: '',
      nurseName: WARD_CONFIG.nurseOnShift,
      countedAt: timeNow,
      targetShift: WARD_CONFIG.nextShift,
      burnRateWarning: item.burnRateWarning,
      estimatedShiftsRemaining: item.estimatedShiftsRemaining,
      burnRateExclusion: item.burnRateExclusion,
    }));
  }, []);

  const [confirmedFlags, setConfirmedFlags] = useState<HandoverFlag[]>(initialDefaultFlags);

  // Computed: check if all bays have been counted
  const allBaysCounted = useMemo(() => {
    return bays.every((b) => b.isCounted);
  }, [bays]);

  // Handler: update count using stepper button (+ / -)
  const handleUpdateCount = (bayId: number, consumableId: string, delta: number) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setStockItems((prevItems) =>
      prevItems.map((item) => {
        if (item.bayId === bayId && item.consumableId === consumableId) {
          const newCount = Math.max(0, item.count + delta);
          return { ...item, count: newCount };
        }
        return item;
      })
    );

    // Update bay's last counted timestamp
    setBays((prevBays) =>
      prevBays.map((bay) => {
        if (bay.id === bayId) {
          return { ...bay, lastCountedAt: nowTime };
        }
        return bay;
      })
    );
  };

  // Handler: mark a bay as counted
  const handleSetBayCounted = (bayId: number) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setBays((prevBays) =>
      prevBays.map((bay) => {
        if (bay.id === bayId) {
          return { ...bay, isCounted: true, lastCountedAt: nowTime };
        }
        return bay;
      })
    );
  };

  // Helper for demo / rapid testing: mark all bays counted
  const handleMarkAllCountedForDemo = () => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setBays((prevBays) =>
      prevBays.map((b) => ({ ...b, isCounted: true, lastCountedAt: b.lastCountedAt || nowTime }))
    );
  };

  // Reset to initial test state
  const handleResetCounts = () => {
    setBays(WARD_CONFIG.initialBays);
    setStockItems(WARD_CONFIG.initialStockItems);
    setConfirmedFlags(initialDefaultFlags);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-100">
      {/* Ward Header with Double Meaning & Clinical Meta */}
      <WardHeader
        wardName={WARD_CONFIG.wardName}
        currentShift={WARD_CONFIG.currentShift}
        nextShift={WARD_CONFIG.nextShift}
        nurseOnShift={WARD_CONFIG.nurseOnShift}
        nurseBadge={WARD_CONFIG.nurseBadge}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        allBaysCounted={allBaysCounted}
        flagsConfirmedCount={confirmedFlags.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Main Content: Single Component Per Screen (Navigates without page reload) */}
      <main className="flex-1 w-full">
        {activeTab === 'round' && (
          <TheRound
            bays={bays}
            stockItems={stockItems}
            onUpdateCount={handleUpdateCount}
            onSetBayCounted={handleSetBayCounted}
            onProceedToLowest={() => setActiveTab('lowest')}
            onMarkAllCountedForDemo={handleMarkAllCountedForDemo}
            onResetCounts={handleResetCounts}
            viewMode={viewMode}
          />
        )}

        {activeTab === 'lowest' && (
          <TheTwoLowest
            stockItems={stockItems}
            nurseName={WARD_CONFIG.nurseOnShift}
            nextShift={WARD_CONFIG.nextShift}
            confirmedFlags={confirmedFlags}
            onConfirmFlags={(flags) => setConfirmedFlags(flags)}
            onProceedToHandover={() => setActiveTab('handover')}
            historicalShifts={WARD_CONFIG.historicalShifts}
            stockMovementEvents={WARD_CONFIG.stockMovementEvents}
            viewMode={viewMode}
          />
        )}

        {activeTab === 'handover' && (
          <Handover
            confirmedFlags={confirmedFlags}
            wardName={WARD_CONFIG.wardName}
            targetShift={WARD_CONFIG.nextShift}
            previousShift={WARD_CONFIG.currentShift}
            outgoingNurse={WARD_CONFIG.nurseOnShift}
            nurseBadge={WARD_CONFIG.nurseBadge}
            allBaysCounted={allBaysCounted}
            viewMode={viewMode}
          />
        )}
      </main>

      {/* Arm's Length Mobile Sticky Action Bar at the bottom */}
      <footer className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2.5 px-4 z-20 shadow-sm">
        <div className={`${viewMode === 'web' ? 'max-w-[1200px]' : 'max-w-3xl'} mx-auto flex items-center justify-between text-xs text-slate-600`}>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="font-bold text-slate-800">AIGH</span>
            <span className="text-slate-400 hidden sm:inline">• Ward 4B (Acute Medical)</span>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'round' && (
              <button
                onClick={() => setActiveTab('lowest')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 uppercase tracking-tight"
              >
                <span>Proceed to The Two Lowest →</span>
              </button>
            )}
            {activeTab === 'lowest' && (
              <button
                onClick={() => setActiveTab('handover')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 uppercase tracking-tight"
              >
                <span>Proceed to Handover →</span>
              </button>
            )}
            {activeTab === 'handover' && (
              <button
                onClick={() => setActiveTab('round')}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 uppercase tracking-tight"
              >
                <span>← Back to The Round</span>
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
