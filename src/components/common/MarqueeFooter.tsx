import React from 'react';

export const MarqueeFooter: React.FC = () => {
  // Animasi Marquee Scroll di Semua Bahagian Bawah Web App:
  // Teks: "Cikgu Najihah" | "Bahasa Melayu KSSR" | "Kembara Kata Nafi"
  const marqueeItems = [
    { text: 'Cikgu Najihah', highlight: true, icon: '👩‍🏫' },
    { text: 'Bahasa Melayu KSSR', highlight: false, icon: '📚' },
    { text: 'Kembara Kata Nafi', highlight: true, icon: '✨' },
    { text: 'Cikgu Najihah', highlight: true, icon: '👩‍🏫' },
    { text: 'Bahasa Melayu KSSR', highlight: false, icon: '📚' },
    { text: 'Kembara Kata Nafi', highlight: true, icon: '🌟' },
  ];

  return (
    <footer className="relative z-20 py-2.5 overflow-hidden no-print bg-amber-200/95 border-t-3 border-slate-900 select-none shadow-neo-sm">
      <div className="flex w-full whitespace-nowrap overflow-hidden">
        {/* Continuous 2-track loop to prevent empty space */}
        <div className="flex items-center gap-5 animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-2xl bg-white border-2 border-slate-900 shadow-neo-sm text-xs font-black text-slate-900 tracking-wide transition-transform hover:scale-105"
            >
              <span className="text-base">{item.icon}</span>
              <span className={item.highlight ? 'text-orange-600 font-black font-heading' : 'text-slate-900 font-extrabold'}>
                {item.text}
              </span>
              <span className="text-amber-500 font-bold ml-1 text-xs">★</span>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

