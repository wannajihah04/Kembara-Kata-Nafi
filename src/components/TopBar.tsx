import React from 'react';
import { NavTab } from '../types';
import { BookOpen, Sparkles, Gamepad2, BarChart3, Lock, LogOut, Volume2, VolumeX, Sparkle } from 'lucide-react';
import { sounds } from '../utils/audio';

interface TopBarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isTeacherMode: boolean;
  onOpenTeacherPin: () => void;
  onExitTeacherMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  currentStudentName: string;
  currentStudentAvatar: string;
  onSelectStudentClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onTabChange,
  isTeacherMode,
  onOpenTeacherPin,
  onExitTeacherMode,
  soundEnabled,
  onToggleSound,
  currentStudentName,
  currentStudentAvatar,
  onSelectStudentClick,
}) => {
  const handleNav = (tab: NavTab) => {
    sounds.playPop();
    onTabChange(tab);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b-2 border-amber-200/70 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Brand Zone */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => handleNav('nota')}
            className="flex items-center gap-2 text-left group transition-transform active:scale-95"
          >
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm ring-2 ring-amber-200 group-hover:rotate-3 transition-transform">
              <span className="text-xl">📚</span>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold font-heading text-slate-800 tracking-tight block">
                KATA NAFI
              </span>
              <span className="text-[11px] font-bold text-amber-700 block -mt-1">
                BUKAN vs TIDAK
              </span>
            </div>
          </button>

          {isTeacherMode && (
            <span className="hidden lg:inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              <Sparkle className="h-3 w-3 fill-emerald-600" />
              PdPC Mod Guru Aktif
            </span>
          )}
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* NOTA */}
          <button
            type="button"
            onClick={() => handleNav('nota')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap active:scale-95 ${
              currentTab === 'nota'
                ? 'bg-amber-400 text-slate-900 shadow-sm ring-2 ring-amber-300/60'
                : 'text-slate-600 hover:bg-amber-100/60 hover:text-slate-900'
            }`}
          >
            <BookOpen className="h-4 w-4 text-amber-800" />
            <span className="tracking-wide">📖 NOTA</span>
          </button>

          {/* FORMULA */}
          <button
            type="button"
            onClick={() => handleNav('formula')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap active:scale-95 ${
              currentTab === 'formula'
                ? 'bg-amber-400 text-slate-900 shadow-sm ring-2 ring-amber-300/60'
                : 'text-slate-600 hover:bg-amber-100/60 hover:text-slate-900'
            }`}
          >
            <Sparkles className="h-4 w-4 text-amber-800" />
            <span className="tracking-wide">💡 FORMULA</span>
          </button>

          {/* KUIZ */}
          <button
            type="button"
            onClick={() => handleNav('permainan')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap active:scale-95 ${
              currentTab === 'permainan'
                ? 'bg-orange-500 text-white shadow-md ring-2 ring-orange-300'
                : 'text-slate-600 hover:bg-orange-100/70 hover:text-orange-950'
            }`}
          >
            <Gamepad2 className="h-4 w-4" />
            <span className="tracking-wide">🎮 KUIZ</span>
          </button>

          {/* TEACHER DASHBOARD (Mod Guru only) */}
          {isTeacherMode && (
            <button
              type="button"
              onClick={() => handleNav('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap active:scale-95 ${
                currentTab === 'dashboard'
                  ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300'
                  : 'text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>📊 DASHBOARD GURU</span>
            </button>
          )}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onToggleSound();
            }}
            className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-900 transition-colors"
            title={soundEnabled ? 'Matikan Bunyi' : 'Hidupkan Bunyi'}
            aria-label="Kawalan Bunyi"
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-amber-700" />
            ) : (
              <VolumeX className="h-4 w-4 text-slate-400" />
            )}
          </button>

          {/* Student Selector / Active Student indicator */}
          {!isTeacherMode ? (
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                onSelectStudentClick();
              }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold hover:bg-sky-100 transition-all"
              title="Tukar Profil Murid"
            >
              <span className="text-base">{currentStudentAvatar}</span>
              <span className="max-w-[100px] truncate">{currentStudentName}</span>
            </button>
          ) : null}

          {/* Mod Guru Button / Exit Button */}
          {!isTeacherMode ? (
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                onOpenTeacherPin();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold border border-slate-300/80 hover:bg-slate-200 hover:border-slate-400 active:scale-95 transition-all cursor-pointer"
            >
              <Lock className="h-3.5 w-3.5 text-slate-600" />
              <span className="hidden sm:inline">Mod Guru</span>
              <span className="sm:hidden">Guru</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                onExitTeacherMode();
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-rose-50 text-rose-700 text-xs sm:text-sm font-bold border border-rose-200 hover:bg-rose-100 active:scale-95 transition-all cursor-pointer"
              title="Keluar daripada Mod Guru"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Keluar Guru</span>
              <span className="sm:hidden">🚪</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
