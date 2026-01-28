import imageConfig from '../config/images.json';
import { getImageFromCache, getImagesByCategoryAndKey, SERVER_BASE } from './imageApi';

// Type definitions for image config
type ImageCategory = keyof typeof imageConfig;
type ImageKey<T extends ImageCategory> = keyof typeof imageConfig[T];

/**
 * Get image URL from database first, fallback to config
 * @param category - Category of the image (e.g., 'header', 'logo', 'programs')
 * @param key - Key of the image within the category
 * @param fallbackType - Type of fallback to use if image is not found
 * @returns Full image path or fallback image path
 */
export function getImage<T extends ImageCategory>(
  category: T,
  key: ImageKey<T>,
  fallbackType?: keyof typeof imageConfig.defaults
): string {
  try {
    // Try to get from database cache first
    const dbImage = getImageFromCache(String(category), String(key));
    if (dbImage && dbImage !== '/placeholder.png') {
      console.log(`✅ Using DB image: ${String(category)}-${String(key)} -> ${dbImage}`);
      return dbImage;
    }

    console.warn(`⚠️ DB image not found, trying JSON config: ${String(category)}.${String(key)}`);

    // Fallback to JSON config
    const imagePath = imageConfig[category][key as keyof typeof imageConfig[T]];
    
    if (!imagePath) {
      console.warn(`Image path is empty for: ${String(category)}.${String(key)}`);
      return getFallbackImage(fallbackType);
    }

    // If image path starts with '/', it's in public folder (already accessible)
    if (typeof imagePath === 'string' && imagePath.startsWith('/')) {
      return imagePath;
    }

    // For assets folder, construct relative path that browser can try to load
    // The ImageWithFallback component will catch errors and show fallback
    const assetPath = `/src/assets/images/${imagePath}`;
    return assetPath;
  } catch (error) {
    console.warn(`Error loading image: ${String(category)}.${String(key)}`, error);
    return getFallbackImage(fallbackType);
  }
}

/**
 * Get fallback/placeholder image
 * @param type - Type of fallback image needed
 * @returns Fallback image path
 */
export function getFallbackImage(
  type?: keyof typeof imageConfig.defaults
): string {
  const fallbackKey = type || 'placeholder';
  return imageConfig.defaults[fallbackKey] || imageConfig.defaults.placeholder;
}

/**
 * Import image dynamically from assets
 * @param imageName - Name of the image file
 * @returns Promise with the imported image
 */
export async function importImage(imageName: string): Promise<string> {
  try {
    const images = import.meta.glob('/src/assets/images/**/*.(png|jpg|jpeg|svg|gif)', {
      eager: false,
      import: 'default'
    });
    
    const imagePath = `/src/assets/images/${imageName}`;
    const imageModule = images[imagePath];
    
    if (!imageModule) {
      console.warn(`Image not found in assets: ${imageName}`);
      return getFallbackImage();
    }
    
    const imported = await imageModule();
    return imported as string;
  } catch (error) {
    console.error('Error importing image:', error);
    return getFallbackImage();
  }
}

/**
 * Preload an image to check if it exists
 * @param src - Image source path
 * @returns Promise that resolves if image loads successfully
 */
export function preloadImage(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * Get image with error handling and fallback
 * @param src - Primary image source
 * @param fallbackType - Type of fallback to use
 * @returns Image source with fallback handling
 */
export function getImageWithFallback(
  src: string | undefined | null,
  fallbackType?: keyof typeof imageConfig.defaults
): string {
  if (!src) {
    return getFallbackImage(fallbackType);
  }
  return src;
}

// Export the config for direct access if needed
export { imageConfig };

// Convenience functions for common image types
export const getHeaderImage = (key: ImageKey<'header'>) => 
  getImage('header', key, 'placeholder');

export const getLogoImage = (key: ImageKey<'logo'>) => 
  getImage('logo', key, 'logo');

export const getProgramImage = (key: ImageKey<'programs'>) => 
  getImage('programs', key, 'program');

export const getProjectImage = (key: ImageKey<'projects'>) => 
  getImage('projects', key, 'project');

export const getEventImage = (key: ImageKey<'events'>) => 
  getImage('events', key, 'event');

export const getBackgroundImage = (key: ImageKey<'backgrounds'>) => 
  getImage('backgrounds', key, 'placeholder');

export const getEmpowermentImage = (key: ImageKey<'empowerment'>) => 
  getImage('empowerment', key, 'placeholder');

export const getOtherImage = (key: ImageKey<'other'>) => 
  getImage('other', key, 'placeholder');

/**
 * Get all hero carousel images from database
 * Category: 'hero', Key: 'carousel'
 * If multiple images exist with same category-key, returns all of them
 * @returns Array of hero slide objects with image URLs and metadata
 */
export function getHeroCarouselImages() {
  console.log('🎠 getHeroCarouselImages called');
  const heroImages = getImagesByCategoryAndKey('hero', 'carousel');
  
  console.log('🎠 Hero carousel images found:', heroImages.length, heroImages);
  
  if (heroImages.length === 0) {
    console.warn('⚠️ No hero carousel images found, using fallback');
    // Return single default slide
    return [
      {
        id: 1,
        title: "Your Thought of Helping\nMight Lighten the\nBurden of Another !",
        subtitle: "Need Help..",
        image: getImage('backgrounds', 'rectBg', 'placeholder'),
        bgColor: "#ede6e6",
      }
    ];
  }

  // Convert database images to carousel slide format
  const slides = heroImages.map((img, index) => ({
    id: index + 1,
    title: img.description || "Your Thought of Helping\nMight Lighten the\nBurden of Another !",
    subtitle: img.alt || "Need Help..",
    image: `${SERVER_BASE}${img.url}`,
    bgColor: "#ede6e6", // You can add this to image metadata in future
  }));
  
  console.log('🎠 Generated carousel slides:', slides);
  return slides;
}

/**
 * Get all campaigns hero images from database
 * Category: 'campaigns', Key: 'hero'
 * If multiple images exist with same category-key, returns all of them
 * @returns Array of campaigns hero slide objects with image URLs and metadata
 */
export function getCampaignsHeroImages() {
  console.log('🎯 getCampaignsHeroImages called');
  const campaignsImages = getImagesByCategoryAndKey('campaigns', 'hero');
  
  console.log('🎯 Campaigns hero images found:', campaignsImages.length, campaignsImages);
  
  if (campaignsImages.length === 0) {
    console.warn('⚠️ No campaigns hero images found, using fallback');
    // Return empty array - let LandingPage header image show instead
    return [];
  }

  // Convert database images to carousel slide format
  const slides = campaignsImages.map((img, index) => ({
    id: index + 1,
    title: img.description || "Our Campaigns",
    subtitle: img.alt || "Support causes that matter",
    image: `${SERVER_BASE}${img.url}`,
    bgColor: "#f0fdf4", // Green theme for campaigns
  }));
  
  console.log('🎯 Generated campaigns carousel slides:', slides);
  return slides;
}

/**
 * Get all programs hero images from database
 * Category: 'programs', Key: 'hero'
 */
export function getProgramsHeroImages() {
  console.log('📚 getProgramsHeroImages called');
  const programsImages = getImagesByCategoryAndKey('programs', 'hero');
  
  console.log('📚 Programs hero images found:', programsImages.length, programsImages);
  
  if (programsImages.length === 0) {
    console.warn('⚠️ No programs hero images found, using fallback');
    // Return empty array - let LandingPage header image show instead
    return [];
  }

  // Convert database images to carousel slide format
  const slides = programsImages.map((img, index) => ({
    id: index + 1,
    title: img.description || "Our Programs",
    subtitle: img.alt || "Empowering Communities",
    image: `${SERVER_BASE}${img.url}`,
    bgColor: "#eff6ff",
  }));
  
  console.log('📚 Generated programs carousel slides:', slides);
  return slides;
}

/**
 * Get all projects hero images from database
 * Category: 'projects', Key: 'hero'
 */
export function getProjectsHeroImages() {
  console.log('🏗️ getProjectsHeroImages called');
  const projectsImages = getImagesByCategoryAndKey('projects', 'hero');
  
  console.log('🏗️ Projects hero images found:', projectsImages.length, projectsImages);
  
  if (projectsImages.length === 0) {
    console.warn('⚠️ No projects hero images found, using fallback');
    // Return empty array - let LandingPage header image show instead
    return [];
  }

  // Convert database images to carousel slide format
  const slides = projectsImages.map((img, index) => ({
    id: index + 1,
    title: img.description || "Our Projects",
    subtitle: img.alt || "Building the Future",
    image: `${SERVER_BASE}${img.url}`,
    bgColor: "#fef3c7",
  }));
  
  console.log('🏗️ Generated projects carousel slides:', slides);
  return slides;
}

/**
 * Get all events hero images from database
 * Category: 'events', Key: 'hero'
 */
export function getEventsHeroImages() {
  console.log('📅 getEventsHeroImages called');
  const eventsImages = getImagesByCategoryAndKey('events', 'hero');
  
  console.log('📅 Events hero images found:', eventsImages.length, eventsImages);
  
  if (eventsImages.length === 0) {
    console.warn('⚠️ No events hero images found, using fallback');
    // Return empty array - let LandingPage header image show instead
    return [];
  }

  // Convert database images to carousel slide format
  const slides = eventsImages.map((img, index) => ({
    id: index + 1,
    title: img.description || "Our Events",
    subtitle: img.alt || "Join Us Together",
    image: `${SERVER_BASE}${img.url}`,
    bgColor: "#eff6ff",
  }));
  
  console.log('📅 Generated events carousel slides:', slides);
  return slides;
}
