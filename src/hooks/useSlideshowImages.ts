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
        alt: 'Modern Villa Construction',
        title: 'Premium Villa Development',
        description: 'Experience luxury living with our premium villa constructions featuring modern architecture and high-end finishes.'
      },
      {
        src: '/slides/slide2.jpg',
        alt: 'Commercial Building',
        title: 'Commercial Excellence',
        description: 'State-of-the-art commercial buildings designed for modern business needs and sustainable operations.'
      },
      {
        src: '/slides/slide3.jpg',
        alt: 'Residential Complex',
        title: 'Residential Communities',
        description: 'Building vibrant communities with thoughtfully designed residential complexes and modern amenities.'
      },
      {
        src: '/slides/slide4.jpg',
        alt: 'Interior Design',
        title: 'Interior Excellence',
        description: 'Complete interior solutions combining functionality with aesthetic appeal for residential and commercial spaces.'
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