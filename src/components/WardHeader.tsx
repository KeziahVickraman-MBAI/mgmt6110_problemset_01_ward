import React from 'react';
import { ScreenTab } from '../types/ward';
import { ClipboardCheck, TrendingDown, FileText, Activity } from 'lucide-react';

interface WardHeaderProps {
  wardName: string;
  currentShift: string;
  nextShift: string;
  nurseOnShift: string;
  nurseBadge: string;
  activeTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  allBaysCounted: boolean;
  flagsConfirmedCount: number;
}

export const WardHeader: React.FC<WardHeaderProps> = ({
  wardName,
  currentShift,
  nextShift,
  nurseOnShift,
  nurseBadge,
  activeTab,
  onSelectTab,
  allBaysCounted,
  flagsConfirmedCount,
}) => {
  return (
    <header className="bg-blue-800 text-white shadow-md border-b border-blue-900 sticky top-0 z-30 font-sans">
      {/* Hospital & Shift Info Banner */}
      <div className="max-w-4xl mx-auto px-4 pt-3.5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tighter text-white flex flex-wrap items-baseline gap-1.5">
              <span>AIGH</span>
              <span className="text-blue-200 font-light text-xs sm:text-sm">
                AI-General Hospital · Am I Good for Handover?
              </span>
            </h1>
            <p className="text-xs text-blue-100/80 font-normal mt-0.5 tracking-wide">
              {wardName}
            </p>
          </div>

          <div className="text-right shrink-0">
            <p className="text-xs sm:text-sm font-semibold text-white leading-tight">
              {nurseOnShift}
            </p>
            <span className="text-[10px] sm:text-xs bg-blue-700 text-blue-100 px-2.5 py-0.5 rounded-full inline-block mt-1 font-semibold uppercase tracking-widest">
              {currentShift}
            </span>
          </div>
        </div>

        {/* Shift Handoff Context Strip */}
        <div className="mt-2.5 pt-2 border-t border-blue-700/60 flex items-center justify-between text-xs text-blue-100">
          <div className="flex items-center gap-1.5">
            <span className="opacity-75">Nurse Credential:</span>
            <span className="font-semibold text-white">{nurseBadge}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="opacity-75">Target Shift:</span>
            <span className="font-semibold text-white bg-blue-900/60 px-2 py-0.5 rounded">
              {nextShift}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Clean Minimalist Bar */}
      <nav aria-label="Main Navigation" className="border-t border-blue-900/40 bg-white shadow-xs">
        <div className="max-w-4xl mx-auto grid grid-cols-3 text-center">
          {/* Tab 1: The Round */}
          <button
            id="nav-the-round"
            onClick={() => onSelectTab('round')}
            className={`min-h-[50px] py-2.5 px-2 flex flex-col items-center justify-center transition-colors relative border-r border-slate-100 ${
              activeTab === 'round'
                ? 'text-blue-700 bg-blue-50/70 font-bold'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <ClipboardCheck className={`h-4 w-4 shrink-0 ${activeTab === 'round' ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className="text-xs sm:text-sm tracking-tight uppercase font-bold">1. The Round</span>
              {allBaysCounted ? (
                <span className="h-2 w-2 rounded-full bg-green-500" title="All bays counted" />
              ) : (
                <span className="h-2 w-2 rounded-full bg-amber-400" title="Counts pending" />
              )}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5">
              {allBaysCounted ? 'Ward completed' : 'Stock count'}
            </span>
            {activeTab === 'round' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600" />
            )}
          </button>

          {/* Tab 2: The Two Lowest */}
          <button
            id="nav-the-lowest"
            onClick={() => onSelectTab('lowest')}
            className={`min-h-[50px] py-2.5 px-2 flex flex-col items-center justify-center transition-colors relative border-r border-slate-100 ${
              activeTab === 'lowest'
                ? 'text-blue-700 bg-blue-50/70 font-bold'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <TrendingDown className={`h-4 w-4 shrink-0 ${activeTab === 'lowest' ? 'text-orange-500' : 'text-slate-400'}`} />
              <span className="text-xs sm:text-sm tracking-tight uppercase font-bold">2. The Lowest</span>
              {flagsConfirmedCount === 2 && (
                <span className="h-2 w-2 rounded-full bg-green-500" title="2 flags confirmed" />
              )}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5">Shortage review</span>
            {activeTab === 'lowest' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600" />
            )}
          </button>

          {/* Tab 3: Handover */}
          <button
            id="nav-the-handover"
            onClick={() => onSelectTab('handover')}
            className={`min-h-[50px] py-2.5 px-2 flex flex-col items-center justify-center transition-colors relative ${
              activeTab === 'handover'
                ? 'text-blue-700 bg-blue-50/70 font-bold'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <FileText className={`h-4 w-4 shrink-0 ${activeTab === 'handover' ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className="text-xs sm:text-sm tracking-tight uppercase font-bold">3. Handover</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5">Incoming nurse</span>
            {activeTab === 'handover' && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600" />
            )}
          </button>
        </div>
      </nav>
    </header>
  );
};
