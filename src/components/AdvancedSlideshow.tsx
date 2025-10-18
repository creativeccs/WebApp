import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SlideImage } from '@/hooks/useSlideshowImages';

interface SlideshowProps {
  images: SlideImage[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showNavigation?: boolean;
  showPagination?: boolean;
  className?: string;
}

export function AdvancedSlideshow({ 
  images, 
  autoPlay = true, 
  autoPlayInterval = 5000,
  showNavigation = true,
  showPagination = true,
  className = ''
}: SlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const goToSlide = useCallback((index: number, dir: 'next' | 'prev' = 'next') => {
    if (isTransitioning || images.length === 0) return;
    
    setIsTransitioning(true);
    setDirection(dir);
    setCurrentIndex(index);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  }, [isTransitioning, images.length]);

  const nextSlide = useCallback(() => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex, 'next');
  }, [currentIndex, images.length, goToSlide]);

  const prevSlide = useCallback(() => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    goToSlide(newIndex, 'prev');
  }, [currentIndex, images.length, goToSlide]);

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, nextSlide, images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  if (images.length === 0) {
    return (
      <div className={`relative w-full h-[80vh] min-h-[700px] bg-muted rounded-lg flex items-center justify-center ${className}`}>
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-[80vh] min-h-[700px] rounded-lg overflow-hidden group ${className}`}>
      <div className="relative w-full h-full">
        {images.map((image, index) => {
          const isCurrent = index === currentIndex;
          const isPrev = index === (currentIndex === 0 ? images.length - 1 : currentIndex - 1);
          const isNext = index === (currentIndex === images.length - 1 ? 0 : currentIndex + 1);
          
          let slideClass = 'opacity-0 pointer-events-none';
          
          if (isCurrent) {
            slideClass = isTransitioning
              ? direction === 'next' ? 'animate-slideInFromRight' : 'animate-slideInFromLeft'
              : 'opacity-100';
          } else if (isTransitioning) {
            if (direction === 'next' && isPrev) slideClass = 'animate-slideOutToLeft';
            else if (direction === 'prev' && isNext) slideClass = 'animate-slideOutToRight';
          }

          return (
            <div key={index} className={`absolute inset-0 w-full h-full transition-opacity duration-600 ${slideClass}`}>
              <img
                src={image.src}
                alt={image.alt || `Slide ${index + 1}`}
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
              

            </div>
          );
        })}
      </div>

      {showNavigation && images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            disabled={isTransitioning}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-50"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            disabled={isTransitioning}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-50"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}

      {showPagination && images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index, index > currentIndex ? 'next' : 'prev')}
              disabled={isTransitioning}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white scale-110' : 'bg-white/70 hover:bg-white/90'
              } disabled:opacity-50`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-medium z-10">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}