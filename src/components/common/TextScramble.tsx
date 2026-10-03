import React, { useState, useEffect, useRef } from 'react';

interface TextScrambleProps {
  text: string;
  className?: string;
  highlightText?: string;
  highlightClassName?: string;
  autoPlayInterval?: number;
}

const GLYPHS = '!<>-_\\/[]{}—=+*^?#________101010~';

export const TextScramble: React.FC<TextScrambleProps> = ({
  text,
  className = '',
  highlightText = '',
  highlightClassName = '',
  autoPlayInterval = 8000,
}) => {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isScrambling, setIsScrambling] = useState<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);

  const startScramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);

    const length = text.length;
    let frame = 0;
    const totalFrames = 30; // ~0.5s at 60fps

    const animate = () => {
      frame++;
      const progress = frame / totalFrames;
      const revealedCount = Math.floor(progress * length);

      let scrambled = '';
      for (let i = 0; i < length; i++) {
        if (text[i] === ' ') {
          scrambled += ' ';
        } else if (i < revealedCount) {
          scrambled += text[i];
        } else {
          scrambled += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }

      setDisplayText(scrambled);

      if (frame < totalFrames) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
        setIsScrambling(false);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    startScramble();

    if (autoPlayInterval > 0) {
      const interval = setInterval(() => {
        startScramble();
      }, autoPlayInterval);
      return () => {
        clearInterval(interval);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [text, autoPlayInterval]);

  // If there's a highlight part, render it appropriately
  if (highlightText && displayText === text) {
    const parts = text.split(highlightText);
    return (
      <span
        onClick={startScramble}
        onMouseEnter={startScramble}
        className={`cursor-pointer inline-block ${className}`}
        title="Klik untuk kesan Text Scramble"
      >
        {parts[0]}
        <span className={highlightClassName}>{highlightText}</span>
        {parts[1] || ''}
      </span>
    );
  }

  return (
    <span
      onClick={startScramble}
      onMouseEnter={startScramble}
      className={`cursor-pointer inline-block ${className}`}
      title="Klik untuk kesan Text Scramble"
    >
      {displayText}
    </span>
  );
};
