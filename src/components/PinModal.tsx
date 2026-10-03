import React, { useState } from 'react';
import { Lock, X, KeyRound, AlertCircle } from 'lucide-react';
import { sounds } from '../utils/audio';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PinModal: React.FC<PinModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string>('');
  const correctPin = '3690';

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    sounds.playPop();
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setError('');
      if (newPin.length === 4) {
        if (newPin === correctPin) {
          sounds.playCorrect();
          setTimeout(() => {
            setPin('');
            onSuccess();
          }, 300);
        } else {
          sounds.playWrong();
          setError('PIN Tidak Sah. Sila cuba lagi.');
          setTimeout(() => {
            setPin('');
          }, 700);
        }
      }
    }
  };

  const handleClear = () => {
    sounds.playPop();
    setPin('');
    setError('');
  };

  const handleVerify = () => {
    sounds.playPop();
    if (pin.length !== 4) {
      sounds.playWrong();
      setError('Sila masukkan 4 digit PIN');
      return;
    }
    if (pin === correctPin) {
      sounds.playCorrect();
      setTimeout(() => {
        setPin('');
        onSuccess();
      }, 300);
    } else {
      sounds.playWrong();
      setError('PIN Tidak Sah. Sila cuba lagi.');
      setTimeout(() => {
        setPin('');
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 border-3 border-slate-900 shadow-neo">
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 rounded-xl border-2 border-slate-900 p-1.5 text-slate-800 hover:bg-slate-100 transition-colors shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          aria-label="Tutup"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-300 border-2 border-slate-900 text-slate-900 shadow-neo-sm">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black font-heading text-slate-900">
            Akses Mod Guru
          </h2>
          <p className="mt-1 text-xs text-slate-600 font-bold">
            Masukkan PIN keselamatan 4-angka untuk membuka dashboard guru.
          </p>
        </div>

        {/* PIN Indicators */}
        <div className="flex justify-center gap-3.5 mb-6">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`h-5 w-5 rounded-full border-2 border-slate-900 transition-all duration-150 ${
                pin.length > index
                  ? 'bg-orange-500 scale-110 shadow-neo-sm'
                  : 'bg-slate-100'
              }`}
            />
          ))}
        </div>

        {error ? (
          <div className="mb-4 flex items-center justify-center gap-1.5 text-xs font-black text-rose-600 bg-rose-50 border-2 border-slate-900 py-1.5 px-3 rounded-xl shadow-neo-sm animate-shake">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="mb-4 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 border-2 border-slate-900 py-1.5 px-3 rounded-xl shadow-neo-sm">
            <KeyRound className="h-3.5 w-3.5 text-slate-600" />
            <span>Sila masukkan 4 digit PIN guru</span>
          </div>
        )}

        {/* Number Keypad */}
        <div className="grid grid-cols-3 gap-2.5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigit(digit)}
              className="flex h-12 items-center justify-center rounded-2xl bg-amber-100 hover:bg-amber-200 text-xl font-black font-heading text-slate-900 border-2 border-slate-900 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="flex h-12 items-center justify-center rounded-2xl bg-slate-100 hover:bg-slate-200 text-xs font-black text-slate-700 border-2 border-slate-900 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            Padam
          </button>
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="flex h-12 items-center justify-center rounded-2xl bg-amber-100 hover:bg-amber-200 text-xl font-black font-heading text-slate-900 border-2 border-slate-900 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleVerify}
            className="flex h-12 items-center justify-center rounded-2xl bg-emerald-400 hover:bg-emerald-500 text-xs font-black text-slate-900 border-2 border-slate-900 shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            title="Sahkan PIN"
          >
            Sahkan
          </button>
        </div>
      </div>
    </div>
  );
};
