"use client"

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageViewerProps {
  src: string;
  alt: string;
  className?: string;
  children?: React.ReactNode;
}

interface ImageGalleryProps {
  images: string[];
  altPrefix: string;
  className?: string;
}

export function ImageViewer({ src, alt, className, children }: ImageViewerProps) {
  // Ensure we have a valid image URL
  const imageSrc = src || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className={`cursor-pointer transition-transform hover:scale-105 ${className}`}>
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 border-0 bg-transparent flex items-center justify-center">
        <VisuallyHidden>
          <DialogTitle>Image Viewer</DialogTitle>
        </VisuallyHidden>
        <Image
          src={imageSrc}
          alt={alt}
          width={1200}
          height={800}
          className="w-auto h-auto max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
          priority
        />
      </DialogContent>
    </Dialog>
  );
}

export function ImageGallery({ images, altPrefix, className }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Filter out empty or invalid image URLs
  const validImages = images.filter(img => img && img.trim() !== '');
  
  // Ensure we have at least one valid image
  if (validImages.length === 0) {
    return <div className="text-center text-muted-foreground p-8">No images available</div>;
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  const openImage = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  return (
    <>
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
        {validImages.map((img, index) => (
          <div
            key={index}
            className="relative w-full h-64 rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform hover:scale-105 bg-black"
            onClick={() => openImage(index)}
          >
            <Image
              src={img}
              alt=""
              fill
              className="object-cover blur-md scale-110"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-blue-950/50" />
            <Image 
              src={img} 
              alt={`${altPrefix} ${index + 1}`} 
              fill 
              className="object-contain"
              data-ai-hint="app screenshot"
            />
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 border-0 bg-transparent flex items-center justify-center">
          <VisuallyHidden>
            <DialogTitle>Image Gallery</DialogTitle>
          </VisuallyHidden>
          <div className="relative">
            <Image
              src={validImages[currentIndex]}
              alt={`${altPrefix} ${currentIndex + 1}`}
              width={1200}
              height={800}
              className="w-auto h-auto max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
              priority
            />
            
            {validImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentIndex + 1} / {validImages.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 