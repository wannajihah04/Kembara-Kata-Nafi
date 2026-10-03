import React from 'react';

interface KineticBounceTextProps {
  className?: string;
  word1?: string;
  word2?: string;
}

export const KineticBounceText: React.FC<KineticBounceTextProps> = ({
  className = '',
  word1 = 'Kembara',
  word2 = 'Kata Nafi',
}) => {
  const letters1 = word1.split('');
  const letters2 = word2.split('');

  return (
    <span className={`inline-flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-3.5 select-none ${className}`}>
      {/* Word 1: Kembara */}
      <span className="inline-flex whitespace-nowrap">
        {letters1.map((char, index) => (
          <span
            key={`w1-${index}`}
            className="animate-kinetic inline-block transition-transform duration-150 hover:scale-125"
            style={{
              animationDelay: `${index * 0.08}s`,
            }}
          >
            {char}
          </span>
        ))}
      </span>

      {/* Word 2: Kata Nafi (Orange themed) */}
      <span className="inline-flex whitespace-nowrap text-orange-500">
        {letters2.map((char, index) => (
          <span
            key={`w2-${index}`}
            className="animate-kinetic inline-block transition-transform duration-150 hover:scale-125"
            style={{
              animationDelay: `${(letters1.length + index) * 0.08}s`,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    </span>
  );
};
