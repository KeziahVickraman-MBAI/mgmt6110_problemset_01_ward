import React, { useState } from 'react';
import { BayStockItem, HandoverFlag } from '../types/ward';
import { TrendingDown, ArrowLeftRight, Check, ArrowRight, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';

interface TheTwoLowestProps {
  stockItems: BayStockItem[];
  nurseName: string;
  nextShift: string;
  confirmedFlags: HandoverFlag[];
  onConfirmFlags: (flags: HandoverFlag[]) => void;
  onProceedToHandover: () => void;
}

// Preset clinical note chips for quick mobile tap
const CLINICAL_NOTE_PRESETS = [
  'Restock on order from pharmacy',
  'Central stores out of stock',
  'High burn rate in acute bay',
  'Urgent morning delivery requested',
];

export const TheTwoLowest: React.FC<TheTwoLowestProps> = ({
  stockItems,
  nurseName,
  nextShift,
  confirmedFlags,
  onConfirmFlags,
  onProceedToHandover,
}) => {
  // Rank all 48 items by deficit (parLevel - count) descending
  const sortedCandidates = [...stockItems]
    .map((item) => {
      const deficit = item.parLevel - item.count;
      const deficitPercentage = Math.round((deficit / item.parLevel) * 100);
      return {
        ...item,
        deficit,
        deficitPercentage,
      };
    })
    .sort((a, b) => b.deficit - a.deficit || a.count - b.count);

  // Initialize selected flags from confirmedFlags if present, else top 2 candidates
  const [slot1Item, setSlot1Item] = useState<typeof sortedCandidates[0]>(() => {
    if (confirmedFlags.length > 0) {
      const match = sortedCandidates.find((c) => c.id === confirmedFlags[0].id);
      if (match) return match;
    }
    return sortedCandidates[0] || null;
  });

  const [slot2Item, setSlot2Item] = useState<typeof sortedCandidates[0]>(() => {
    if (confirmedFlags.length > 1) {
      const match = sortedCandidates.find((c) => c.id === confirmedFlags[1].id);
      if (match) return match;
    }
    return sortedCandidates[1] || null;
  });

  const [note1, setNote1] = useState<string>(() => confirmedFlags[0]?.note || '');
  const [note2, setNote2] = useState<string>(() => confirmedFlags[1]?.note || '');
  const [isSaved, setIsSaved] = useState<boolean>(confirmedFlags.length === 2);

  // Find next 3 candidates excluding current slot1 and slot2
  const nextCandidates = sortedCandidates
    .filter((c) => c.id !== slot1Item?.id && c.id !== slot2Item?.id)
    .slice(0, 3);

  // Clinical swap handler
  const handleSwap = (candidate: typeof sortedCandidates[0], targetSlot: 1 | 2) => {
    if (targetSlot === 1) {
      setSlot1Item(candidate);
    } else {
      setSlot2Item(candidate);
    }
    setIsSaved(false); // require re-confirm when swapped
  };

  const handleResetToTop2 = () => {
    setSlot1Item(sortedCandidates[0]);
    setSlot2Item(sortedCandidates[1]);
    setIsSaved(false);
  };

  const handleConfirm = () => {
    if (!slot1Item || !slot2Item) return;

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const flag1: HandoverFlag = {
      id: slot1Item.id,
      bayId: slot1Item.bayId,
      bayName: slot1Item.bayName,
      consumableId: slot1Item.consumableId,
      consumableName: slot1Item.consumableName,
      unit: slot1Item.unit,
      count: slot1Item.count,
      par: slot1Item.parLevel,
      deficit: slot1Item.deficit,
      deficitPercentage: slot1Item.deficitPercentage,
      note: note1.trim(),
      nurseName,
      countedAt: nowTime,
      targetShift: nextShift,
    };

    const flag2: HandoverFlag = {
      id: slot2Item.id,
      bayId: slot2Item.bayId,
      bayName: slot2Item.bayName,
      consumableId: slot2Item.consumableId,
      consumableName: slot2Item.consumableName,
      unit: slot2Item.unit,
      count: slot2Item.count,
      par: slot2Item.parLevel,
      deficit: slot2Item.deficit,
      deficitPercentage: slot2Item.deficitPercentage,
      note: note2.trim(),
      nurseName,
      countedAt: nowTime,
      targetShift: nextShift,
    };

    onConfirmFlags([flag1, flag2]);
    setIsSaved(true);
  };

  return (
    <div className="space-y-4 pb-20 max-w-3xl mx-auto px-3 sm:px-4 pt-3">
      {/* Screen Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span>The Two Lowest</span>
            <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold">
              Ward Shortage Flags
            </span>
          </h2>
          <p className="text-xs text-slate-600">
            Automatically picked by deficit from round counts. Confirm or swap using clinical judgement.
          </p>
        </div>

        <button
          onClick={handleResetToTop2}
          className="text-xs text-slate-600 hover:text-slate-900 underline shrink-0 px-2 py-1"
        >
          Reset to Top 2
        </button>
      </div>

      {/* Confirmation Status Banner (Worked When...) */}
      {isSaved ? (
        <div
          id="flags-confirmed-banner"
          className="bg-green-50 border border-green-300 rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
              ✓
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-green-900 text-base">Two Flags Confirmed for Handover</h3>
                <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
              <p className="text-xs text-green-800 mt-1">
                These two items are locked and will appear on the incoming <strong>{nextShift}</strong> screen.
              </p>
              <div className="mt-3">
                <button
                  id="btn-view-handover-screen"
                  onClick={onProceedToHandover}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow transition-transform active:scale-95 uppercase tracking-tight"
                >
                  <span>View Handover Screen</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between gap-2 text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-blue-600 shrink-0" />
            <span>
              Review the 2 flags below. You can swap with candidate items or add a short note before confirming.
            </span>
          </div>
        </div>
      )}

      {/* THE TWO PRIMARY FLAGS - Clean Minimalism Styled */}
      <div className="bg-slate-900 rounded-xl p-4 shadow-xl border border-slate-800 space-y-3.5">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <h3 className="text-white font-bold flex items-center gap-2 text-sm tracking-tight">
            <span className="bg-orange-500 text-[10px] px-1.5 py-0.5 rounded font-bold text-white uppercase">
              AI
            </span>
            <span>2. THE LOWEST</span>
          </h3>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
            Ranked by Par Deficit
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Flag 1 Card */}
          {slot1Item && (
            <div
              id="primary-flag-1"
              className="bg-slate-800 rounded-lg p-3.5 border-l-4 border-orange-500 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Primary Shortage #1
                  </p>
                  <span className="text-[10px] font-mono font-bold text-orange-400">
                    –{slot1Item.deficit} units
                  </span>
                </div>
                <h4 className="text-xl text-white font-bold tracking-tight mt-0.5">
                  {slot1Item.consumableName}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  <strong className="text-white">{slot1Item.bayName}</strong> • Count: {slot1Item.count} (Par: {slot1Item.parLevel} {slot1Item.unit.split(' ')[0]})
                </p>
                <p className="text-[11px] text-orange-400 italic font-medium mt-1">
                  {slot1Item.deficitPercentage}% below par level
                </p>
              </div>

              {/* Note input for incoming shift */}
              <div className="pt-2 border-t border-slate-700/60 space-y-1">
                <input
                  id="note-slot-1"
                  type="text"
                  maxLength={90}
                  value={note1}
                  onChange={(e) => {
                    setNote1(e.target.value);
                    setIsSaved(false);
                  }}
                  placeholder="Add note for incoming nurse..."
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
                />
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {CLINICAL_NOTE_PRESETS.slice(0, 2).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setNote1(preset);
                        setIsSaved(false);
                      }}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Flag 2 Card */}
          {slot2Item && (
            <div
              id="primary-flag-2"
              className="bg-slate-800 rounded-lg p-3.5 border-l-4 border-orange-500 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Primary Shortage #2
                  </p>
                  <span className="text-[10px] font-mono font-bold text-orange-400">
                    –{slot2Item.deficit} units
                  </span>
                </div>
                <h4 className="text-xl text-white font-bold tracking-tight mt-0.5">
                  {slot2Item.consumableName}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  <strong className="text-white">{slot2Item.bayName}</strong> • Count: {slot2Item.count} (Par: {slot2Item.parLevel} {slot2Item.unit.split(' ')[0]})
                </p>
                <p className="text-[11px] text-orange-400 italic font-medium mt-1">
                  {slot2Item.deficitPercentage}% below par level
                </p>
              </div>

              {/* Note input for incoming shift */}
              <div className="pt-2 border-t border-slate-700/60 space-y-1">
                <input
                  id="note-slot-2"
                  type="text"
                  maxLength={90}
                  value={note2}
                  onChange={(e) => {
                    setNote2(e.target.value);
                    setIsSaved(false);
                  }}
                  placeholder="Add note for incoming nurse..."
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
                />
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {CLINICAL_NOTE_PRESETS.slice(2, 4).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setNote2(preset);
                        setIsSaved(false);
                      }}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Handover Flags Button */}
        <button
          type="button"
          id="btn-confirm-flags"
          onClick={handleConfirm}
          className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg uppercase tracking-tighter shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <Check className="h-4 w-4" />
          <span>Confirm Handover Flags for {nextShift}</span>
        </button>
      </div>

      {/* THE NEXT THREE CANDIDATES */}
      <div className="pt-4 border-t border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Next 3 Candidates</h3>
            <p className="text-xs text-slate-500">
              Ranked 3rd, 4th, and 5th lowest. Swap one into Slot 1 or 2 if clinical judgement dictates.
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {nextCandidates.map((cand, index) => (
            <div
              key={cand.id}
              id={`candidate-card-${cand.id}`}
              className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                    Rank #{index + 3}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{cand.bayName}:</span>
                  <span className="font-semibold text-slate-800 text-sm">{cand.consumableName}</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Count: <strong className="text-slate-800">{cand.count}</strong> / Par: {cand.parLevel} (
                  <span className="text-amber-700 font-medium">−{cand.deficit} below par</span>)
                </div>
              </div>

              {/* Swap Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  id={`btn-swap-slot1-${cand.id}`}
                  onClick={() => handleSwap(cand, 1)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-800 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1 transition-colors"
                >
                  <ArrowLeftRight className="h-3 w-3" />
                  <span>Swap to Flag 1</span>
                </button>
                <button
                  type="button"
                  id={`btn-swap-slot2-${cand.id}`}
                  onClick={() => handleSwap(cand, 2)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-amber-50 hover:text-amber-800 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1 transition-colors"
                >
                  <ArrowLeftRight className="h-3 w-3" />
                  <span>Swap to Flag 2</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
