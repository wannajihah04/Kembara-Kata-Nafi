import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { sounds } from '../utils/audio';

interface PageNavigationFooterProps {
  onBack: () => void;
  onNext: () => void;
  backLabel?: string;
  nextLabel?: string;
  backSubtext?: string;
  nextSubtext?: string;
  disableBack?: boolean;
  disableNext?: boolean;
}

export const PageNavigationFooter: React.FC<PageNavigationFooterProps> = ({
  onBack,
  onNext,
  backLabel = 'Kembali',
  nextLabel = 'Seterusnya',
  backSubtext,
  nextSubtext,
  disableBack = false,
  disableNext = false,
}) => {
  return (
    <div className="w-full mt-8 pt-5 border-t-2 border-slate-900/10 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
      {/* Tombol Kembali */}
      <button
        type="button"
        disabled={disableBack}
        onClick={() => {
          sounds.playPop();
          onBack();
        }}
        className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm border-2 border-slate-900 transition-all ${
          disableBack
            ? 'opacity-40 bg-slate-100 text-slate-400 cursor-not-allowed border-slate-300'
            : 'bg-white text-slate-800 shadow-neo hover:bg-slate-50 hover:-translate-x-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-neo-sm'
        }`}
      >
        <ArrowLeft className="h-4 w-4 text-slate-700 stroke-[2.5]" />
        <div className="text-left">
          <span className="block leading-tight font-extrabold">{backLabel}</span>
          {backSubtext && <span className="text-[10px] text-slate-500 font-semibold block">{backSubtext}</span>}
        </div>
      </button>

      {/* Tombol Seterusnya */}
      <button
        type="button"
        disabled={disableNext}
        onClick={() => {
          sounds.playPop();
          onNext();
        }}
        className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm border-2 border-slate-900 transition-all ${
          disableNext
            ? 'opacity-40 bg-slate-100 text-slate-400 cursor-not-allowed border-slate-300'
            : 'bg-amber-300 text-slate-900 shadow-neo hover:bg-amber-400 hover:translate-x-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-neo-sm'
        }`}
      >
        <div className="text-right">
          <span className="block leading-tight font-extrabold">{nextLabel}</span>
          {nextSubtext && <span className="text-[10px] text-amber-900 font-semibold block">{nextSubtext}</span>}
        </div>
        <ArrowRight className="h-4 w-4 text-slate-900 stroke-[2.5]" />
      </button>
    </div>
  );
};
