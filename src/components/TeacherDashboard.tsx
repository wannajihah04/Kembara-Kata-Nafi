import React, { useState } from 'react';
import { TeacherSubTab, Student } from '../types';
import { PageNavigationFooter } from './PageNavigationFooter';
import { ConfirmModal } from './ConfirmModal';
import { 
  TrendingUp, Users, Download, Search, FileSpreadsheet, 
  CheckCircle, AlertCircle, Award, BarChart3, School, UserCheck,
  RotateCcw
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface TeacherDashboardProps {
  currentSubTab: TeacherSubTab;
  onSubTabChange: (subTab: TeacherSubTab) => void;
  students: Student[];
  onBackToModeSelect: () => void;
  onGoToDemo: () => void;
  onResetScores?: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  currentSubTab,
  onSubTabChange,
  students,
  onBackToModeSelect,
  onGoToDemo,
  onResetScores,
}) => {
  const [showResetToast, setShowResetToast] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tpFilter, setTpFilter] = useState<number | 'all'>('all');
  const [classFilter, setClassFilter] = useState<'all' | 'BM3' | 'BM4'>('all');

  // Editable school config - Kelas BM 3 & BM 4
  const [schoolName, setSchoolName] = useState('SK Kompleks Jalan Sultan, Kuala Lumpur');
  const [className, setClassName] = useState('Kelas BM 3 & BM 4');
  const [teacherName, setTeacherName] = useState('Cikgu Noraini binti Yusof');

  // KPI Calculations
  const classScopedStudents = students.filter(
    (s) => classFilter === 'all' || s.kelas === classFilter || (!s.kelas && classFilter === 'BM4')
  );
  const totalStudents = classScopedStudents.length;
  const averagePercentage = Math.round(
    classScopedStudents.reduce((acc, s) => acc + s.percentage, 0) / (totalStudents || 1)
  );
  const masteryCount = classScopedStudents.filter(s => s.percentage >= 65).length;
  const masteryRate = Math.round((masteryCount / (totalStudents || 1)) * 100);

  // Filtered Students
  const filteredStudents = classScopedStudents.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTp = tpFilter === 'all' || s.tpLevel === tpFilter;
    return matchesSearch && matchesTp;
  });

  // CSV Download generator
  const handleDownloadCSV = () => {
    sounds.playPop();
    const headers = [
      'ID Murid',
      'Nama Murid',
      'Kelas',
      'Skor Aras 1 (Gerabak /8)',
      'Skor Aras 2 (Isi Tempat Kosong /8)',
      'Skor Aras 3 (Padanan Ayat /8)',
      'Skor Aras 4 (Silang Kata /8)',
      'Skor Bonus (Cabaran Pantas /10)',
      'Baki Nyawa',
      'Jumlah Skor (/42)',
      'Peratus Penguasaan (%)',
      'Tahap Penguasaan PBD (TP)',
      'Masa Selesai'
    ];

    const rows = filteredStudents.map((s) => [
      `"${s.id}"`,
      `"${s.name}"`,
      `"${s.kelas || 'BM4'}"`,
      s.scoreL1,
      s.scoreL2,
      s.scoreL3,
      s.scoreL4,
      s.scoreBonus,
      s.remainingLives,
      s.totalScore,
      `${s.percentage}%`,
      `TP ${s.tpLevel}`,
      `"${s.completedAt || '2026-10-02'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Rekod_Pentaksiran_Kata_Nafi_${className.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmResetAll = () => {
    setConfirmModalOpen(false);
    onResetScores?.();
    setShowResetToast(true);
    setTimeout(() => setShowResetToast(false), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        title="Tetapkan Semula Rekod Murid"
        message="Adakah anda pasti mahu menetapkan semula SEMUA markah murid dalam rekod kepada 0 (nilai asal)?"
        subMessage="Semua skor bagi murid Kelas BM 3 dan BM 4 akan dikembalikan kepada nilai asal 0."
        confirmLabel="Ya, Tetapkan Semula Semua"
        cancelLabel="Batal"
        onConfirm={handleConfirmResetAll}
        onCancel={() => setConfirmModalOpen(false)}
      />

      {/* Toast Notification when reset */}
      {showResetToast && (
        <div className="p-4 rounded-2xl bg-emerald-400 border-3 border-slate-900 shadow-neo flex items-center justify-between gap-3 text-slate-900 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 stroke-[2.5]" />
            <span className="text-xs sm:text-sm font-black">
              🔄 Semua skor rekod murid telah berjaya ditetapkan semula kepada 0 (asal)!
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowResetToast(false)}
            className="text-xs font-black px-2 py-1 rounded-lg bg-white border border-slate-900 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Sub-Tabs Selector Header in Neobrutalism Style */}
      <div className="relative flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-white border-3 border-slate-900 shadow-neo no-print">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
              Dashboard Pentaksiran Bilik Darjah (PBD)
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
              Panel Pengurusan Guru
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onSubTabChange('analisis');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black border-2 border-slate-900 transition-all active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ${
              currentSubTab === 'analisis'
                ? 'bg-emerald-300 text-slate-900 shadow-neo-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            📈 Analisis Kelas
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onSubTabChange('rekod');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black border-2 border-slate-900 transition-all active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ${
              currentSubTab === 'rekod'
                ? 'bg-emerald-300 text-slate-900 shadow-neo-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            📋 Rekod Murid
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onSubTabChange('muatturun');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black border-2 border-slate-900 transition-all active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ${
              currentSubTab === 'muatturun'
                ? 'bg-emerald-300 text-slate-900 shadow-neo-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            📥 Pusat Muat Turun
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: ANALISIS KELAS */}
      {/* ========================================================================= */}
      {currentSubTab === 'analisis' && (
        <div className="space-y-6">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border-2 border-slate-900 shadow-neo flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-200 border-2 border-slate-900 text-slate-900 flex items-center justify-center font-black text-xl shadow-neo-sm">
                📈
              </div>
              <div>
                <p className="text-xs font-black text-slate-500 uppercase">Purata Skor Kelas</p>
                <p className="text-2xl font-black font-heading text-slate-900 mt-0.5">
                  {averagePercentage}%
                </p>
                <p className="text-[11px] text-emerald-700 font-bold">Gred Purata: B (Kepujian)</p>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border-2 border-slate-900 shadow-neo flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-sky-200 border-2 border-slate-900 text-slate-900 flex items-center justify-center font-black text-xl shadow-neo-sm">
                🎯
              </div>
              <div>
                <p className="text-xs font-black text-slate-500 uppercase">Peratus Penguasaan</p>
                <p className="text-2xl font-black font-heading text-slate-900 mt-0.5">
                  {masteryRate}%
                </p>
                <p className="text-[11px] text-sky-700 font-bold">{masteryCount}/{totalStudents} murid melepasi TP 4</p>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border-2 border-slate-900 shadow-neo flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-200 border-2 border-slate-900 text-slate-900 flex items-center justify-center font-black text-xl shadow-neo-sm">
                👥
              </div>
              <div>
                <p className="text-xs font-black text-slate-500 uppercase">Murid Selesai</p>
                <p className="text-2xl font-black font-heading text-slate-900 mt-0.5">
                  {totalStudents} / {totalStudents}
                </p>
                <p className="text-[11px] text-amber-800 font-bold">100% Penyertaan Murid</p>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border-2 border-slate-900 shadow-neo flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-rose-200 border-2 border-slate-900 text-slate-900 flex items-center justify-center font-black text-xl shadow-neo-sm">
                ⚠️
              </div>
              <div>
                <p className="text-xs font-black text-slate-500 uppercase">Aras Paling Mencabar</p>
                <p className="text-lg font-black font-heading text-rose-700 mt-0.5">
                  Kes Pertentangan
                </p>
                <p className="text-[11px] text-rose-600 font-bold">Kekeliruan "...tetapi..."</p>
              </div>
            </div>
          </div>

          {/* Item Analysis & Diagnostics Table */}
          <div className="rounded-3xl bg-white border-3 border-slate-900 p-6 shadow-neo space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b-2 border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black font-heading text-slate-900 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-emerald-600" />
                  <span>Analisis Item &amp; Diagnostik Ralat Soalan (Item Analysis)</span>
                </h3>
                <p className="text-xs text-slate-600 font-semibold">
                  Data diagnostik kesilapan bagi merangka program intervensi murid.
                </p>
              </div>
              <span className="bg-slate-100 border border-slate-900 text-slate-900 text-xs font-black px-3 py-1 rounded-full">
                Sampel: {totalStudents} Murid
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-800">
                <thead className="bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900">
                  <tr>
                    <th className="py-3 px-4">Kategori Frasa</th>
                    <th className="py-3 px-4">Contoh Soalan Kerap Salah</th>
                    <th className="py-3 px-4">Jawapan Tepat</th>
                    <th className="py-3 px-4">Kadar Kesilapan</th>
                    <th className="py-3 px-4">Tindakan Intervensi Guru</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-100 font-semibold">
                  <tr className="hover:bg-rose-50/50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      Kes Istimewa (...tetapi...)
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      "Murid pintar itu _____ malas belajar, tetapi dia berasa penat."
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-700">BUKAN</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-rose-600">42% salah</span>
                        <div className="w-16 bg-slate-200 h-2 rounded-full border border-slate-900 overflow-hidden">
                          <div className="bg-rose-500 h-full" style={{ width: '42%' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-rose-800 bg-rose-100 border border-slate-900 px-2.5 py-0.5 rounded-full shadow-neo-sm">
                        <AlertCircle className="h-3 w-3" /> Perlu Bimbingan Fokus
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-amber-50/50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      Frasa Sendi Nama (FSN)
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      "Bungkusan pos laju ini _____ daripada pengetua kolej."
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-700">BUKAN</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-amber-700">28% salah</span>
                        <div className="w-16 bg-slate-200 h-2 rounded-full border border-slate-900 overflow-hidden">
                          <div className="bg-amber-500 h-full" style={{ width: '28%' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-900 bg-amber-100 border border-slate-900 px-2.5 py-0.5 rounded-full shadow-neo-sm">
                        Ulang Formula B.N.S
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      Frasa Adjektif (FA)
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      "Air sungai di kawasan hulu itu _____ dalam seperti disangka."
                    </td>
                    <td className="py-3.5 px-4 font-black text-sky-700">TIDAK</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-600">14% salah</span>
                        <div className="w-16 bg-slate-200 h-2 rounded-full border border-slate-900 overflow-hidden">
                          <div className="bg-emerald-500 h-full" style={{ width: '14%' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-900 bg-emerald-100 border border-slate-900 px-2.5 py-0.5 rounded-full shadow-neo-sm">
                        <CheckCircle className="h-3 w-3" /> Penguasaan Baik
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      Frasa Kerja (FK)
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      "Bapanya _____ sempat membaca akhbar kerana tergesa-gesa."
                    </td>
                    <td className="py-3.5 px-4 font-black text-sky-700">TIDAK</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-600">9% salah</span>
                        <div className="w-16 bg-slate-200 h-2 rounded-full border border-slate-900 overflow-hidden">
                          <div className="bg-emerald-500 h-full" style={{ width: '9%' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-900 bg-emerald-100 border border-slate-900 px-2.5 py-0.5 rounded-full shadow-neo-sm">
                        <CheckCircle className="h-3 w-3" /> Sangat Baik
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Page Navigation Footer */}
          <PageNavigationFooter
            onBack={onBackToModeSelect}
            onNext={() => onSubTabChange('rekod')}
            backLabel="Pilihan Mod"
            backSubtext="Tukar ke Mod Murid / Utama"
            nextLabel="Seterusnya: Rekod Murid"
            nextSubtext="Senarai Skor PBD Individu"
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: REKOD MURID */}
      {/* ========================================================================= */}
      {currentSubTab === 'rekod' && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col gap-3 p-4 rounded-3xl bg-white border-2 border-slate-900 shadow-neo">
            {/* Baris 1: Pilihan Kelas */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-slate-700 shrink-0">Pilihan Kelas:</span>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setClassFilter('all');
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-black border-2 border-slate-900 transition-all cursor-pointer ${
                    classFilter === 'all'
                      ? 'bg-amber-300 text-slate-900 shadow-neo-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Semua Kelas ({students.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setClassFilter('BM3');
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-black border-2 border-slate-900 transition-all cursor-pointer ${
                    classFilter === 'BM3'
                      ? 'bg-amber-300 text-slate-900 shadow-neo-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Kelas BM 3 ({students.filter(s => s.kelas === 'BM3').length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setClassFilter('BM4');
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-black border-2 border-slate-900 transition-all cursor-pointer ${
                    classFilter === 'BM4'
                      ? 'bg-amber-300 text-slate-900 shadow-neo-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Kelas BM 4 ({students.filter(s => s.kelas === 'BM4' || !s.kelas).length})
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500">
                  Memaparkan {filteredStudents.length} rekod murid
                </span>
                <button
                  type="button"
                  onClick={() => setConfirmModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-200 hover:bg-rose-300 text-slate-900 text-xs font-black border-2 border-slate-900 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                  title="Tetapkan semula semua skor murid kepada 0 atau asal"
                >
                  <RotateCcw className="h-4 w-4 text-rose-700 stroke-[2.5]" />
                  <span>Tetapkan Semula</span>
                </button>
              </div>
            </div>

            {/* Baris 2: Carian & Filter TP */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama murid..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-slate-900 text-xs sm:text-sm text-slate-900 font-bold focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                <span className="text-xs font-black text-slate-700 mr-1 shrink-0">Tahap PBD:</span>
                {(['all', 6, 5, 4, 3, 2] as const).map((tp) => (
                  <button
                    key={String(tp)}
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setTpFilter(tp);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 border-slate-900 transition-all active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ${
                      tpFilter === tp
                        ? 'bg-emerald-300 text-slate-900 shadow-neo-sm'
                        : 'bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {tp === 'all' ? 'Semua' : `TP ${tp}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Student Records Table */}
          <div className="rounded-3xl bg-white border-3 border-slate-900 shadow-neo overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-800">
                <thead className="bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900">
                  <tr>
                    <th className="py-3 px-4">Murid</th>
                    <th className="py-3 px-3 text-center">Aras 1</th>
                    <th className="py-3 px-3 text-center">Aras 2</th>
                    <th className="py-3 px-3 text-center">Aras 3</th>
                    <th className="py-3 px-3 text-center">Aras 4</th>
                    <th className="py-3 px-3 text-center">Bonus</th>
                    <th className="py-3 px-3 text-center">Jumlah Skor</th>
                    <th className="py-3 px-3 text-center">Peratus</th>
                    <th className="py-3 px-3 text-center">Tahap PBD</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-100 font-semibold">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-2.5">
                          <span className="text-xl">{s.avatar}</span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-extrabold text-slate-900">{s.name}</p>
                              <span className="text-[10px] font-black px-1.5 py-0.5 bg-slate-200 text-slate-800 rounded border border-slate-300">
                                {s.kelas || 'BM4'}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono">{s.id}</p>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold">{s.scoreL1} / 8</td>
                        <td className="py-3 px-3 text-center font-mono font-bold">{s.scoreL2} / 8</td>
                        <td className="py-3 px-3 text-center font-mono font-bold">{s.scoreL3} / 8</td>
                        <td className="py-3 px-3 text-center font-mono font-bold">{s.scoreL4} / 8</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-orange-600">{s.scoreBonus} / 10</td>
                        <td className="py-3 px-3 text-center font-mono font-black text-slate-900">{s.totalScore} / 42</td>
                        <td className="py-3 px-3 text-center font-bold">
                          <span className={`px-2 py-0.5 rounded-md text-xs font-black border border-slate-900 shadow-neo-sm ${
                            s.percentage >= 85 ? 'bg-emerald-200 text-slate-900' :
                            s.percentage >= 65 ? 'bg-sky-200 text-slate-900' :
                            s.percentage >= 50 ? 'bg-amber-200 text-slate-900' : 'bg-rose-200 text-slate-900'
                          }`}>
                            {s.percentage}%
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-900 border border-slate-900">
                            TP {s.tpLevel}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-900 border border-slate-900 shadow-neo-sm">
                            <CheckCircle className="h-3 w-3 text-emerald-600" />
                            <span>Direkodkan</span>
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-500 font-bold">
                        Tiada murid ditemui bagi carian "{searchQuery}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Page Navigation Footer */}
          <PageNavigationFooter
            onBack={() => onSubTabChange('analisis')}
            onNext={() => onSubTabChange('muatturun')}
            backLabel="Kembali ke Analisis Kelas"
            backSubtext="Carta & Statistik Item"
            nextLabel="Seterusnya: Pusat Muat Turun"
            nextSubtext="Eksport CSV & Slip Rasmi PBD"
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: PUSAT MUAT TURUN */}
      {/* ========================================================================= */}
      {currentSubTab === 'muatturun' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-emerald-100 border-3 border-slate-900 p-6 shadow-neo">
            <h3 className="text-xl font-black font-heading text-slate-900 flex items-center gap-2">
              <Download className="h-5 w-5 text-emerald-800" />
              <span>Pusat Muat Turun Data Pentaksiran Murid (PBD)</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-800 font-semibold mt-1">
              Eksport fail spreadsheet CSV lengkap untuk pengurusan data bilik darjah bagi Google Sheets dan Microsoft Excel.
            </p>
          </div>

          {/* Action Download Center */}
          <div className="rounded-3xl bg-white border-3 border-slate-900 p-6 sm:p-8 shadow-neo max-w-2xl mx-auto space-y-5 text-center">
            <div className="h-16 w-16 rounded-2xl bg-emerald-200 border-2 border-slate-900 text-slate-900 flex items-center justify-center text-3xl mx-auto shadow-neo-sm">
              📊
            </div>
            <div>
              <h4 className="text-xl font-black font-heading text-slate-900">
                Eksport Lembaran Pentaksiran (CSV)
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-2 leading-relaxed max-w-lg mx-auto">
                Menjana fail data <code>.csv</code> yang mengandungi skor Aras 1 hingga 4, cabaran bonus, peratus penguasaan, dan Tahap Penguasaan (TP 1 – TP 6) semua murid kelas. Sedia dibuka terus di <strong>Microsoft Excel</strong> atau diimport ke <strong>Google Sheets</strong>.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleDownloadCSV}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 py-3.5 px-8 rounded-2xl bg-emerald-400 hover:bg-emerald-500 text-slate-900 text-sm font-black border-2 border-slate-900 shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <FileSpreadsheet className="h-5 w-5" />
                <span>🟩 Muat Turun Fail CSV (Excel / Sheets)</span>
              </button>
            </div>
          </div>

          {/* Page Navigation Footer */}
          <PageNavigationFooter
            onBack={() => onSubTabChange('rekod')}
            onNext={onGoToDemo}
            backLabel="Kembali ke Rekod Murid"
            backSubtext="Jadual Markah PBD Kelas"
            nextLabel="Seterusnya: Demo PdPC Bilik Darjah"
            nextSubtext="Buka Nota & Kuiz untuk Mengajar"
          />
        </div>
      )}
    </div>
  );
};
