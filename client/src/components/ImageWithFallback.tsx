import React, { useState, useEffect } from 'react';
import { getImageWithFallback, getFallbackImage, imageConfig } from '../utils/imageLoader';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallbackType?: keyof typeof imageConfig.defaults;
  alt: string;
}

/**
 * Image component with automatic fallback support
 * If the primary image fails to load, it will show a placeholder
 */
export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  fallbackType = 'placeholder',
  alt,
  onError,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState<string>(
    getImageWithFallback(src, fallbackType)
  );
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset error state when src changes
    setHasError(false);
    const newSrc = getImageWithFallback(src, fallbackType);
    console.log('🖼️ ImageWithFallback src changed:', { original: src, resolved: newSrc });
    setImageSrc(newSrc);
  }, [src, fallbackType]);

  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError) {
      console.error('❌ Image failed to load:', imageSrc, 'Event:', event);
      setHasError(true);
      const fallbackImg = getFallbackImage(fallbackType);
      console.log('Using fallback image:', fallbackImg);
      setImageSrc(fallbackImg);
      
      // Call the original onError if provided
      if (onError) {
        onError(event);
      }
    }
  };

  return (
    <img
      {...props}
      src={imageSrc}
      alt={alt}
      onError={handleError}
      loading={props.loading || 'lazy'}
    />
  );
};

export default ImageWithFallback;
