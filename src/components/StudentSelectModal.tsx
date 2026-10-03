import React, { useState } from 'react';
import { Student } from '../types';
import { X, UserPlus, Check } from 'lucide-react';
import { getAvatarForName } from '../data/kataNafiData';
import { sounds } from '../utils/audio';

interface StudentSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  currentStudentId: string;
  onSelectStudent: (student: Student) => void;
  onAddNewStudent: (name: string, avatar: string, kelas?: 'BM3' | 'BM4') => void;
}

const AVATAR_OPTIONS = ['👦🏽', '🧕🏽', '👧🏻', '👦🏻', '👧🏾', '🧒🏼'];

export const StudentSelectModal: React.FC<StudentSelectModalProps> = ({
  isOpen,
  onClose,
  students,
  currentStudentId,
  onSelectStudent,
  onAddNewStudent,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterClass, setFilterClass] = useState<'all' | 'BM3' | 'BM4'>('BM3');
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState('👦🏽');
  const [newClass, setNewClass] = useState<'BM3' | 'BM4'>('BM3');

  if (!isOpen) return null;

  const filteredStudents = students.filter((s) => {
    if (filterClass === 'all') return true;
    return s.kelas === filterClass || (!s.kelas && filterClass === 'BM4');
  });

  const handleSelect = (s: Student) => {
    sounds.playPop();
    onSelectStudent(s);
    onClose();
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    sounds.playCorrect();
    const finalAvatar = getAvatarForName(newName.trim(), newAvatar);
    onAddNewStudent(newName.trim(), finalAvatar, newClass);
    setNewName('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 border-3 border-slate-900 shadow-neo overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 rounded-xl border-2 border-slate-900 p-1.5 text-slate-800 hover:bg-slate-100 transition-colors shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 cursor-pointer z-20"
          aria-label="Tutup"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-4 pr-16 sm:pr-24">
          <h2 className="text-xl font-black font-heading text-slate-900">
            Pilih Profil Murid
          </h2>
          <p className="text-xs text-slate-600 font-bold">
            Pilih nama anda daripada senarai kelas BM 3 atau BM 4.
          </p>
        </div>

        {/* Tab Pilihan Kelas */}
        {!showAddForm && (
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-300 mb-3">
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                setFilterClass('BM3');
              }}
              className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                filterClass === 'BM3'
                  ? 'bg-amber-300 text-slate-900 border border-slate-900 shadow-neo-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kelas BM 3
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                setFilterClass('BM4');
              }}
              className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                filterClass === 'BM4'
                  ? 'bg-amber-300 text-slate-900 border border-slate-900 shadow-neo-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kelas BM 4
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                setFilterClass('all');
              }}
              className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                filterClass === 'all'
                  ? 'bg-white text-slate-900 border border-slate-900 shadow-neo-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua
            </button>
          </div>
        )}

        {!showAddForm ? (
          <div className="space-y-3">
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {filteredStudents.map((s) => {
                const isSelected = s.id === currentStudentId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelect(s)}
                    className={`w-full text-left p-3 rounded-2xl border-2 border-slate-900 transition-all flex items-center justify-between gap-3 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-300 text-slate-900 shadow-neo-sm'
                        : 'bg-white hover:bg-slate-50 shadow-neo-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{s.avatar}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs sm:text-sm font-black text-slate-900 leading-snug">{s.name}</p>
                          <span className="text-[10px] font-black px-1.5 py-0.5 bg-slate-200 text-slate-800 rounded border border-slate-400">
                            {s.kelas || 'BM4'}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-slate-600">
                          Skor: {s.totalScore}/42 · {s.percentage}% (TP {s.tpLevel})
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="p-1 rounded-lg bg-slate-900 text-white border border-slate-900">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                sounds.playPop();
                setShowAddForm(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-900 text-xs font-black border-2 border-slate-900 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              <span>Daftar Murid Baharu</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleAddSubmit} className="space-y-4 animate-in fade-in duration-150">
            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">
                Pilih Kelas:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNewClass('BM3')}
                  className={`py-1.5 px-3 rounded-lg border-2 text-xs font-black cursor-pointer ${
                    newClass === 'BM3' ? 'bg-amber-300 border-slate-900 shadow-neo-sm' : 'bg-white border-slate-300'
                  }`}
                >
                  Kelas BM 3
                </button>
                <button
                  type="button"
                  onClick={() => setNewClass('BM4')}
                  className={`py-1.5 px-3 rounded-lg border-2 text-xs font-black cursor-pointer ${
                    newClass === 'BM4' ? 'bg-amber-300 border-slate-900 shadow-neo-sm' : 'bg-white border-slate-300'
                  }`}
                >
                  Kelas BM 4
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">
                Nama Penuh Murid:
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewName(val);
                  if (val.trim()) {
                    setNewAvatar(getAvatarForName(val, newAvatar));
                  }
                }}
                placeholder="Contoh: MUHAMMAD FARIS BIN AHMAD"
                className="w-full px-3 py-2 text-xs rounded-xl border-2 border-slate-900 font-bold bg-white text-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-black text-slate-700">
                  Pilih Avatar:
                </label>
                <span className="text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  Aktif: {newAvatar}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setNewAvatar(av)}
                    className={`h-9 w-9 rounded-xl border-2 text-lg flex items-center justify-center transition-all cursor-pointer ${
                      newAvatar === av
                        ? 'border-slate-900 bg-amber-300 shadow-neo-sm scale-110'
                        : 'border-slate-200 bg-white hover:bg-slate-100'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-2.5 rounded-xl border-2 border-slate-900 text-xs font-black bg-white hover:bg-slate-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl border-2 border-slate-900 text-xs font-black bg-amber-300 hover:bg-amber-400 shadow-neo-sm cursor-pointer"
              >
                Simpan Profil
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
