import { useState, useEffect } from 'react';

export interface SlideImage {
  src: string;
  alt?: string;
  title?: string;
  description?: string;
}

// Hook to get slideshow images from public/slides folder
export function useSlideshowImages(): SlideImage[] {
  const [images, setImages] = useState<SlideImage[]>([]);

  useEffect(() => {
    const defaultImages: SlideImage[] = [
      {
        src: '/slides/slide1.jpg',
        alt: 'Modern Omani Architecture',
        title: 'Excellence in Oman',
        description: 'Leading construction and real estate development in the Sultanate of Oman'
       },
      {
        src: '/slides/slide2.jpg',
        alt: 'Luxury Properties in Oman',
        title: 'Premium Real Estate',
        description: 'Modern villas and commercial buildings designed for Omani lifestyle'
       },
      {
        src: '/slides/slide3.jpg',
        alt: 'Construction Excellence in Oman',
        title: 'Professional Construction',
        description: 'Expert construction services across Muscat and all Oman governorates'
       },
      {
        src: '/slides/slide4.jpg',
        alt: 'Modern Omani Interior Design',
        title: 'Complete Solutions',
        description: 'From planning to finishing - comprehensive services in Oman'
       }
    ];

    // Check if images exist and filter out missing ones
    const checkImages = async () => {
      const availableImages: SlideImage[] = [];
      
      for (const image of defaultImages) {
        try {
          const response = await fetch(image.src, { method: 'HEAD' });
          if (response.ok) {
            availableImages.push(image);
          }
        } catch {
          // Image not found, skip it
        }
      }

      // If no images are found, use placeholder from Unsplash
      if (availableImages.length === 0) {
        setImages([
          {
            src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop',
            alt: 'Modern Building',
            title: 'Creative Construction Solution',
            description: 'Leading the way in innovative construction and real estate development across Oman.'
          },
          {
            src: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=600&fit=crop',
            alt: 'Residential Development',
            title: 'Residential Excellence',
            description: 'Creating beautiful homes and communities that enhance quality of life.'
          },
          {
            src: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&h=600&fit=crop',
            alt: 'Commercial Construction',
            title: 'Commercial Projects',
            description: 'Delivering world-class commercial construction projects with precision and excellence.'
          }
        ]);
      } else {
        setImages(availableImages);
      }
    };

    checkImages();
  }, []);

  return images;
}