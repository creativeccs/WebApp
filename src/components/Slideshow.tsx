import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import type { SlideImage } from '@/hooks/useSlideshowImages';

interface SlideshowProps {
  images: SlideImage[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showControls?: boolean;
  showDots?: boolean;
  className?: string;
}

export function Slideshow({
  images,
  autoPlay = true,
  autoPlayInterval = 5000,
  showControls = true,
  showDots = true,
  className = '',
}: SlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, images.length, autoPlayInterval]);

  // Preload images
  useEffect(() => {
    if (images.length === 0) {
      setIsLoading(false);
      return;
    }

    const preloadImages = async () => {
      const imagePromises = images.map((image) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve; // Continue even if image fails to load
          img.src = image.src;
        });
      });

      await Promise.all(imagePromises);
      setIsLoading(false);
    };

    preloadImages();
  }, [images]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (images.length === 0) {
    return (
      <Card className={`flex items-center justify-center h-96 bg-muted ${className}`}>
        <p className="text-muted-foreground">No images available</p>
      </Card>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-lg bg-background ${className}`}>
      {/* Main Image */}
      <div className="relative aspect-[16/9] md:aspect-[21/9]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        ) : (
          <img
            src={images[currentIndex]?.src}
            alt={images[currentIndex]?.alt || `Slide ${currentIndex + 1}`}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          />
        )}

        {/* Gradient Overlay for Text */}
        {(images[currentIndex]?.title || images[currentIndex]?.description) && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        )}

        {/* Text Overlay */}
        {(images[currentIndex]?.title || images[currentIndex]?.description) && (
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            {images[currentIndex]?.title && (
              <h3 className="text-2xl md:text-4xl font-bold mb-2">
                {images[currentIndex].title}
              </h3>
            )}
            {images[currentIndex]?.description && (
              <p className="text-lg md:text-xl opacity-90 max-w-2xl">
                {images[currentIndex].description}
              </p>
            )}
          </div>
        )}

        {/* Navigation Controls */}
        {showControls && images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="sm"
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100 transition-opacity"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="secondary"
              size="sm"
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100 transition-opacity"
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Play/Pause Button */}
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4 opacity-80 hover:opacity-100 transition-opacity"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex 
                  ? 'bg-white' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

