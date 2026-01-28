// API-based image loader that fetches from database
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001/api/v1/';
// Extract server base URL from API_BASE_URL (remove /api/v1 or /api/v1/)
const SERVER_BASE = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

interface ImageData {
  _id: string;
  name: string;
  filename: string;
  category: string;
  key: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  description?: string;
  alt?: string;
  isActive: boolean;
}

// Cache for images to avoid repeated API calls - now supports multiple images per category-key
let imageCache: Map<string, ImageData[]> | null = null;
let cachePromise: Promise<void> | null = null;

/**
 * Fetch all images from database and cache them
 */
async function loadImageCache(): Promise<void> {
  if (imageCache) return; // Already loaded
  
  if (cachePromise) {
    // Already loading, wait for it
    await cachePromise;
    return;
  }

  cachePromise = (async () => {
    try {
      console.log('📸 Fetching images from:', `${API_BASE_URL}images/list`);
      const response = await fetch(`${API_BASE_URL}images/list`);
      const data = await response.json();
      
      console.log('📸 API Response:', data);
      
      if (data.success && Array.isArray(data.data)) {
        imageCache = new Map();
        
        // Index by category-key combination - now supports multiple images per key
        data.data.forEach((img: ImageData) => {
          if (img.isActive) {
            const cacheKey = `${img.category}-${img.key}`;
            const existingImages = imageCache!.get(cacheKey) || [];
            existingImages.push(img);
            imageCache!.set(cacheKey, existingImages);
            console.log(`📸 Cached: ${cacheKey} -> ${img.url}`);
          }
        });
        
        const totalImages = Array.from(imageCache.values()).reduce((sum, imgs) => sum + imgs.length, 0);
        console.log(`✅ Loaded ${totalImages} images from database (${imageCache.size} unique category-key combinations)`);
        console.log('📸 Cache keys:', Array.from(imageCache.keys()));
      }
    } catch (error) {
      console.error('❌ Failed to load images from database:', error);
      imageCache = new Map(); // Empty cache to prevent repeated failures
    } finally {
      cachePromise = null;
    }
  })();

  await cachePromise;
}

/**
 * Get image URL from database by category and key
 * @param category - Image category (e.g., 'header', 'logo', 'other')
 * @param key - Image key within the category
 * @returns Full image URL from server or fallback (returns first match if multiple)
 */
export async function getImageFromDb(category: string, key: string): Promise<string> {
  await loadImageCache();
  
  const cacheKey = `${category}-${key}`;
  const images = imageCache?.get(cacheKey);
  
  if (images && images.length > 0) {
    // Return full URL to server's upload folder (first image if multiple)
    return `${SERVER_BASE}${images[0].url}`;
  }
  
  console.warn(`Image not found in database: ${category}.${key}`);
  return '/placeholder.png'; // Fallback
}

/**
 * Get image synchronously (uses cached data)
 * Call loadImageCache() once at app startup to pre-populate cache
 * @param category - Image category
 * @param key - Image key
 * @returns Image URL or placeholder if not in cache (returns first match if multiple)
 */
export function getImageFromCache(category: string, key: string): string {
  if (!imageCache) {
    console.warn('Image cache not loaded yet. Call loadImageCache() first.');
    return '/placeholder.png';
  }
  
  const cacheKey = `${category}-${key}`;
  const images = imageCache.get(cacheKey);
  
  if (images && images.length > 0) {
    console.log(`✓ Found image in cache: ${cacheKey} -> ${SERVER_BASE}${images[0].url}`);
    return `${SERVER_BASE}${images[0].url}`;
  }
  
  console.warn(`✗ Image not found in cache: ${cacheKey}. Available keys:`, Array.from(imageCache.keys()));
  return '/placeholder.png';
}

/**
 * Refresh the image cache (call this after updating images in admin)
 */
export async function refreshImageCache(): Promise<void> {
  imageCache = null;
  cachePromise = null;
  await loadImageCache();
}

/**
 * Get all images for a specific category
 * @param category - Image category
 * @returns Array of images in that category
 */
export function getImagesByCategory(category: string): ImageData[] {
  if (!imageCache) return [];
  
  const images: ImageData[] = [];
  imageCache.forEach((imageArray) => {
    imageArray.forEach((img) => {
      if (img.category === category) {
        images.push(img);
      }
    });
  });
  
  return images;
}

/**
 * Get all images for a specific category and key (for carousel/multiple images)
 * @param category - Image category
 * @param key - Image key
 * @returns Array of all images matching category and key
 */
export function getImagesByCategoryAndKey(category: string, key: string): ImageData[] {
  if (!imageCache) {
    console.warn('Image cache not loaded yet.');
    return [];
  }
  
  const cacheKey = `${category}-${key}`;
  const images = imageCache.get(cacheKey) || [];
  
  // Sort by _id to ensure consistent order
  const sortedImages = [...images].sort((a, b) => a._id.localeCompare(b._id));
  
  console.log(`Found ${sortedImages.length} images for ${category}-${key}`);
  return sortedImages;
}

// Export the load function and server base URL
export { loadImageCache, SERVER_BASE };
