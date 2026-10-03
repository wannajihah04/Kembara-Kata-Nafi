import React from 'react';
import { TeacherSubTab } from '../types';
import { TrendingUp, Users, Download } from 'lucide-react';
import { sounds } from '../utils/audio';

interface TeacherSubBarProps {
  currentSubTab: TeacherSubTab;
  onSubTabChange: (subTab: TeacherSubTab) => void;
}

export const TeacherSubBar: React.FC<TeacherSubBarProps> = ({
  currentSubTab,
  onSubTabChange,
}) => {
  const handleSelect = (subTab: TeacherSubTab) => {
    sounds.playPop();
    onSubTabChange(subTab);
  };

  return (
    <div className="w-full bg-emerald-50/90 border-b border-emerald-200/80 px-4 py-2 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Menu Pentaksiran:
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => handleSelect('analisis')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
              currentSubTab === 'analisis'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white/80 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>📈 Analisis Kelas</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelect('rekod')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
              currentSubTab === 'rekod'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white/80 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>📋 Rekod Murid</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelect('muatturun')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
              currentSubTab === 'muatturun'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white/80 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <Download className="h-3.5 w-3.5" />
            <span>📥 Pusat Muat Turun</span>
          </button>
        </div>
      </div>
    </div>
  );
};
