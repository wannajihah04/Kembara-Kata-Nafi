import React from 'react';
import { AlertCircle, RotateCcw, X } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  subMessage?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = 'Pengesahan Tetapkan Semula',
  message,
  subMessage = 'Tindakan ini akan mengembalikan skor kepada nilai asal (0).',
  confirmLabel = 'Ya, Tetapkan Semula',
  cancelLabel = 'Batal',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-3xl bg-white border-3 sm:border-4 border-slate-900 p-6 sm:p-7 shadow-neo-lg space-y-4 text-center animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            sounds.playPop();
            onCancel();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-xl border-2 border-slate-900 bg-slate-100 hover:bg-slate-200 text-slate-800 transition-transform active:scale-95 cursor-pointer"
          title="Tutup"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Warning Icon Badge */}
        <div className="h-16 w-16 mx-auto rounded-2xl bg-amber-300 border-2 border-slate-900 flex items-center justify-center text-3xl shadow-neo">
          <RotateCcw className="h-8 w-8 text-rose-700 stroke-[2.5]" />
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
          {title}
        </h3>

        {/* Message */}
        <div className="space-y-1">
          <p className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed">
            {message}
          </p>
          {subMessage && (
            <p className="text-xs text-slate-500 font-semibold">
              {subMessage}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              onCancel();
            }}
            className="w-full sm:w-auto flex-1 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-black border-2 border-slate-900 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playCorrect();
              onConfirm();
            }}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-black border-2 border-slate-900 shadow-neo active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <RotateCcw className="h-4 w-4 stroke-[2.5]" />
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
