import React, { useState, useEffect } from 'react';

interface TeacherPortraitProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
}

export const TeacherPortrait: React.FC<TeacherPortraitProps> = ({
  className = '',
  size = 'md',
}) => {
  const originalUrl = 'https://res.cloudinary.com/k9n0nsfr/image/upload/v1790997703/photo_2026-10-03_11-21-12.jpg';
  const [imageSrc, setImageSrc] = useState<string>(originalUrl);

  // Client-side canvas transparent background generator
  // Removes white/off-white background to ensure transparent background
  useEffect(() => {
    let isMounted = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = originalUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Convert pure white & light background pixels to transparent
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // If the pixel is near-white background
          if (r > 235 && g > 235 && b > 235) {
            data[i + 3] = 0; // Fully transparent
          } else if (r > 210 && g > 210 && b > 210) {
            // Feathered soft edge
            const brightness = (r + g + b) / 3;
            const factor = Math.max(0, (235 - brightness) / 25);
            data[i + 3] = Math.round(data[i + 3] * factor);
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const processedUrl = canvas.toDataURL('image/png');
        if (isMounted) {
          setImageSrc(processedUrl);
        }
      } catch {
        // In case of any canvas security error, keep original with CSS mix-blend-multiply
      }
    };

    return () => {
      isMounted = false;
    };
  }, [originalUrl]);

  const sizeClasses = {
    sm: 'h-14 sm:h-16 w-auto',
    md: 'h-20 sm:h-24 w-auto',
    lg: 'h-28 sm:h-36 lg:h-40 w-auto',
    xl: 'h-36 sm:h-48 lg:h-56 w-auto',
    hero: 'h-44 sm:h-56 lg:h-64 w-auto',
  }[size];

  return (
    <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>
      <img
        src={imageSrc}
        alt="Cikgu Najihah"
        className={`${sizeClasses} object-contain mix-blend-multiply drop-shadow-lg select-none pointer-events-none transition-transform hover:scale-105`}
        loading="eager"
      />
    </div>
  );
};
