import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text?: string;
  speed?: number;
  highlightText?: string;
  highlightClassName?: string;
  className?: string;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text = 'Kembara Kata Nafi!',
  speed = 90,
  highlightText = 'Kata Nafi!',
  highlightClassName = 'text-amber-300 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]',
  className = '',
}) => {
  const [displayedLength, setDisplayedLength] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayedLength < text.length) {
      // Typing forward
      timeout = setTimeout(() => {
        setDisplayedLength(prev => prev + 1);
      }, speed);
    } else if (!isDeleting && displayedLength === text.length) {
      // Pause at full text before optional soft loop (pause for 5 seconds)
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 5000);
    } else if (isDeleting && displayedLength > 0) {
      // Deleting backward slightly faster
      timeout = setTimeout(() => {
        setDisplayedLength(prev => prev - 1);
      }, speed / 2);
    } else if (isDeleting && displayedLength === 0) {
      // Start typing again after brief pause
      timeout = setTimeout(() => {
        setIsDeleting(false);
      }, 600);
    }

    return () => clearTimeout(timeout);
  }, [displayedLength, isDeleting, text, speed]);

  const currentString = text.slice(0, displayedLength);

  // If text has a highlight part (e.g. "Kata Nafi!"), render with styling
  const renderStyledContent = () => {
    if (!highlightText || !text.includes(highlightText)) {
      return <span>{currentString}</span>;
    }

    const highlightStartIndex = text.indexOf(highlightText);

    if (displayedLength <= highlightStartIndex) {
      return <span>{currentString}</span>;
    }

    const firstPart = text.slice(0, highlightStartIndex);
    const highlightedPart = currentString.slice(highlightStartIndex);

    return (
      <>
        <span>{firstPart}</span>
        <span className={highlightClassName}>{highlightedPart}</span>
      </>
    );
  };

  return (
    <span className={`inline-flex items-center tracking-tight select-none ${className}`}>
      <span>{renderStyledContent()}</span>
      {/* Blinking typewriter cursor */}
      <span className="inline-block w-[3px] sm:w-[4px] h-[0.9em] bg-amber-300 ml-1.5 animate-pulse rounded-full align-middle shadow-[0_0_8px_#fde047]" />
    </span>
  );
};
