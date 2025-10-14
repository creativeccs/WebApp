import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade, Parallax, Keyboard, Mousewheel } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import type { SlideImage } from '@/hooks/useSlideshowImages';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/parallax';

interface SlideshowProps {
  images: SlideImage[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  height?: string;
  showNavigation?: boolean;
  showPagination?: boolean;
  effect?: 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip';
  className?: string;
}

export function AdvancedSlideshow({ 
  images, 
  autoPlay = true, 
  autoPlayInterval = 5000,
  height = '600px',
  showNavigation = true,
  showPagination = true,
  effect = 'fade',
  className = ''
}: SlideshowProps) {
  const swiperRef = useRef<SwiperType>();

  if (images.length === 0) {
    return (
      <div 
        className={`relative w-full bg-muted rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  return (
    <div 
      className={`relative w-full rounded-lg overflow-hidden group ${className}`}
      style={{ height }}
    >
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade, Parallax, Keyboard, Mousewheel]}
        spaceBetween={0}
        slidesPerView={1}
        effect={effect}
        speed={1000}
        parallax={true}
        keyboard={{
          enabled: true,
        }}
        mousewheel={{
          forceToAxis: true,
        }}
        navigation={showNavigation ? {
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        } : false}
        pagination={showPagination ? {
          el: '.swiper-pagination-custom',
          clickable: true,
          renderBullet: (index: number, className: string) => {
            return `<span class="${className} !bg-white/70 hover:!bg-white !w-3 !h-3 !mx-1 transition-all duration-300"></span>`;
          },
        } : false}
        autoplay={autoPlay ? {
          delay: autoPlayInterval,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        } : false}
        loop={images.length > 1}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="w-full h-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="relative">
            <div 
              className="absolute inset-0 w-full h-full"
              data-swiper-parallax="-300"
            >
              <img
                src={image.src}
                alt={image.alt || `Slide ${index + 1}`}
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              {/* Advanced gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
            </div>
            
            {/* Content overlay area */}
            <div className="absolute inset-0 flex items-end justify-start p-8">
              <div 
                className="text-white max-w-2xl"
                data-swiper-parallax="-200"
                data-swiper-parallax-opacity="0"
                data-swiper-parallax-duration="1000"
              >
                {image.title && (
                  <h3 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">
                    {image.title}
                  </h3>
                )}
                {image.description && (
                  <p className="text-lg md:text-xl text-white/90 drop-shadow-md">
                    {image.description}
                  </p>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons */}
        {showNavigation && (
          <>
            <div className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <div className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white cursor-pointer transition-all duration-300 opacity-0 group-hover:opacity-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </>
        )}

        {/* Custom Pagination */}
        {showPagination && (
          <div className="swiper-pagination-custom absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex space-x-2"></div>
        )}

        {/* Slide Counter */}
        <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-medium z-10">
          <span className="swiper-counter">1</span> / {images.length}
        </div>
      </Swiper>
    </div>
  );
}