'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ResponsiveImageProps {
  src: string;
  alt: string;
}

export function ResponsiveImage({ src, alt }: ResponsiveImageProps) {
  const [imageClass, setImageClass] = useState('transition-transform duration-300 group-hover:scale-105');

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const isLandscape = img.naturalWidth > img.naturalHeight;
    const newClass = `transition-transform duration-300 group-hover:scale-105 ${isLandscape ? 'object-cover' : 'object-contain'}`;
    setImageClass(newClass);
  };

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={imageClass}
      onLoad={handleImageLoad}
    />
  );
}
