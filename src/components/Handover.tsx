import React from 'react';
import { HandoverFlag } from '../types/ward';
import { ShieldCheck, Clock, User, AlertCircle, CheckCircle2, FileCheck2 } from 'lucide-react';

interface HandoverProps {
  confirmedFlags: HandoverFlag[];
  wardName: string;
  targetShift: string;
  previousShift: string;
  outgoingNurse: string;
  nurseBadge: string;
  allBaysCounted: boolean;
}

export const Handover: React.FC<HandoverProps> = ({
  confirmedFlags,
  wardName,
  targetShift,
  previousShift,
  outgoingNurse,
  nurseBadge,
  allBaysCounted,
}) => {
  return (
    <div className="space-y-4 pb-20 max-w-3xl mx-auto px-3 sm:px-4 pt-3">
      {/* Screen Title & Read-Only Notice */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span>Handover</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
              Read-Only Incoming Screen
            </span>
          </h2>
          <p className="text-xs text-slate-600">
            For incoming nurses: stock shortage flags handed over from previous shift.
          </p>
        </div>

        <div className="flex items-center gap-1 text-xs text-emerald-800 bg-emerald-100 px-2 py-1 rounded-md font-semibold">
          <ShieldCheck className="h-4 w-4" />
          <span>Active</span>
        </div>
      </div>

      {/* Ward & Shift Handover Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase block">
              Inpatient Ward
            </span>
            <h3 className="font-bold text-base text-slate-900">{wardName}</h3>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Shift</span>
            <span className="font-bold text-blue-600 text-sm">{targetShift}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-slate-400">Counted by: </span>
              <strong className="text-slate-800">{outgoingNurse}</strong> ({nurseBadge})
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400 shrink-0" />
            <div>
              <span className="text-slate-400">Handed over from: </span>
              <span className="text-slate-700 font-medium">{previousShift}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flag Count Status */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
        <span>
          {confirmedFlags.length === 0
            ? '0 shortages flagged'
            : `${confirmedFlags.length} consumable short-stock flags for handover`}
        </span>
        <span className="flex items-center gap-1 text-slate-400">
          <FileCheck2 className="h-3.5 w-3.5" />
          <span>Ward audit: {allBaysCounted ? 'All 8 bays checked' : 'Checks in progress'}</span>
        </span>
      </div>

      {/* Current Flags or Empty State */}
      {confirmedFlags.length === 0 ? (
        /* Empty state mandated by prompt: "nothing flagged this shift" rather than looking broken */
        <div
          id="handover-empty-state"
          className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3 shadow-sm my-6"
        >
          <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto font-bold text-lg">
            ✓
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900">
              Nothing flagged this shift
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Every bay across the ward is currently stocked at or above acceptable par levels. No consumable shortages have been flagged for the incoming shift.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {confirmedFlags.map((flag, index) => (
            <div
              key={flag.id}
              id={`handover-flag-card-${flag.id}`}
              className={`rounded-xl border p-4 shadow-sm space-y-3 relative overflow-hidden ${
                index === 0 ? 'bg-red-50/50 border-red-200' : 'bg-orange-50/40 border-orange-200'
              }`}
            >
              {/* Flag Priority Ribbon */}
              <div
                className={`absolute top-0 right-0 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-bl-lg ${
                  index === 0 ? 'bg-red-600' : 'bg-orange-500'
                }`}
              >
                FLAG #{index + 1}
              </div>

              {/* Bay & Item Title */}
              <div className="pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-white text-[11px] font-bold tracking-tight">
                    {flag.bayName}
                  </span>
                  <span className="text-[11px] text-slate-500 uppercase font-medium">Inpatient Bay</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  {flag.consumableName}
                </h3>
                <p className="text-xs text-slate-500">
                  Unit: {flag.unit}
                </p>
              </div>

              {/* High Visibility Numbers */}
              <div className="grid grid-cols-3 gap-2 bg-white rounded-lg p-3 border border-slate-200 text-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block">
                    Current Count
                  </span>
                  <span className="text-2xl font-mono font-bold text-red-600 leading-tight block">
                    {flag.count < 10 ? `0${flag.count}` : flag.count}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block">
                    Par Level
                  </span>
                  <span className="text-2xl font-mono font-bold text-slate-800 leading-tight block">
                    {flag.par < 10 ? `0${flag.par}` : flag.par}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block">
                    Shortage
                  </span>
                  <span className="text-2xl font-mono font-bold text-red-700 leading-tight block">
                    −{flag.deficit}
                  </span>
                </div>
              </div>

              {/* Burn Rate Warning Line: One line of text appended to each flag */}
              {flag.burnRateWarning && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg px-3 py-2 text-xs font-semibold flex flex-wrap items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>{flag.burnRateWarning}</span>
                  {flag.burnRateExclusion && (
                    <span className="text-amber-800/80 font-normal text-[11px] bg-amber-100/70 px-1.5 py-0.5 rounded border border-amber-300/60">
                      {flag.burnRateExclusion}
                    </span>
                  )}
                </div>
              )}

              {/* Note (if provided) */}
              {flag.note ? (
                <div className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 block">Outgoing Nurse Note:</span>
                    <span className="text-slate-600 leading-snug">{flag.note}</span>
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-slate-400 italic px-1">
                  No clinical note attached by outgoing nurse.
                </div>
              )}

              {/* Audit Sign-off */}
              <div className="border-t border-slate-200/60 pt-2 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-y-1">
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span>Counted by: </span>
                  <strong className="text-slate-700">{flag.nurseName}</strong>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>Verified at: </span>
                  <strong className="text-slate-700">{flag.countedAt}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Incoming Shift Acknowledgment Action */}
      <div className="pt-2">
        <button
          type="button"
          className="w-full py-3 bg-slate-900 hover:bg-black text-white font-bold rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform"
        >
          <ShieldCheck className="h-4 w-4 text-green-400" />
          <span>Acknowledge &amp; Accept Shift Handover</span>
        </button>
      </div>

      {/* Bottom Information Callout */}
      <div className="bg-slate-100 rounded-xl p-3.5 border border-slate-200 text-xs text-slate-600 leading-relaxed">
        <p className="font-semibold text-slate-800 mb-0.5">Incoming Nurse Protocol</p>
        <p>
          This screen is locked and view-only. Check flagged bays upon shift arrival. Flagged items indicate stock replenishment is required from central store or pharmacy.
        </p>
      </div>
    </div>
  );
};
