import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import multer from 'multer';
import Image from '../models/Image';
import { CustomRequest } from '../middleware/auth';
import sharp from 'sharp';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (_req: any, _file: any, cb: any) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error as Error, uploadDir);
    }
  },
  filename: (_req: any, file: any, cb: any) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext)
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter - only allow images
const fileFilter: multer.Options['fileFilter'] = (_req: any, file: any, cb: any) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: fileFilter,
});

/**
 * Upload an image file
 */
export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = (req as any).file as any;
    
    if (!file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
      return;
    }

    const filename = file.filename;
    const category = req.body.category || 'other';
    const key = req.body.key || filename;
    const name = req.body.name || file.originalname;
    const description = req.body.description || '';
    const alt = req.body.alt || name;

    // Get image dimensions if it's an image
    let width, height;
    try {
      const metadata = await sharp(file.path).metadata();
      width = metadata.width;
      height = metadata.height;
    } catch (error) {
      // Not an image or sharp failed, skip dimensions
      console.log('Could not get image dimensions:', error);
    }

    // Get user ID from authenticated request
    const customReq = req as CustomRequest;
    const uploadedBy = customReq.user?._id;

    // Save to database
    const image = new Image({
      name,
      filename,
      originalName: file.originalname,
      category,
      key,
      url: `/uploads/${filename}`,
      mimeType: file.mimetype,
      size: file.size,
      width,
      height,
      description,
      alt,
      uploadedBy,
      isActive: true,
    });

    await image.save();

    // Update images.json configuration
    try {
      const configPath = path.join(__dirname, '../../../client/src/config/images.json');
      const configData = await fs.readFile(configPath, 'utf-8');
      const config = JSON.parse(configData);

      // Update the specific category and key
      if (config[category]) {
        config[category][key] = filename;
        await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
      }
    } catch (error) {
      console.error('Failed to update images.json:', error);
      // Continue anyway, image is saved in DB
    }

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: image,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Update images.json configuration
 */
export const updateImageConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    const config = req.body;

    if (!config || typeof config !== 'object') {
      res.status(400).json({
        success: false,
        message: 'Invalid configuration data'
      });
      return;
    }

    // Path to images.json in client folder
    const configPath = path.join(__dirname, '../../../client/src/config/images.json');

    // Write the updated config
    await fs.writeFile(
      configPath,
      JSON.stringify(config, null, 2),
      'utf-8'
    );

    res.status(200).json({
      success: true,
      message: 'Image configuration updated successfully'
    });
  } catch (error) {
    console.error('Config update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update configuration',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get current images.json configuration
 */
export const getImageConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    const configPath = path.join(__dirname, '../../../client/src/config/images.json');
    const configData = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(configData);

    res.status(200).json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Config read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to read configuration',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Delete an uploaded image
 */
export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find image in database
    const image = await Image.findById(id);

    if (!image) {
      res.status(404).json({
        success: false,
        message: 'Image not found in database'
      });
      return;
    }

    const filePath = path.join(__dirname, '../../uploads', image.filename);

    // Delete physical file
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.warn('File not found on disk:', image.filename);
      // Continue to delete from database even if file doesn't exist
    }

    // Delete from database
    await Image.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get a single image by ID
 */
export const getImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const image = await Image.findById(id).populate('uploadedBy', 'name email');

    if (!image) {
      res.status(404).json({
        success: false,
        message: 'Image not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: image
    });
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get image',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Update image metadata
 */
export const updateImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const file = (req as any).file as any;
    
    // Get fields from request body
    const { name, description, alt, category, key, isActive } = req.body;

    const image = await Image.findById(id);

    if (!image) {
      res.status(404).json({
        success: false,
        message: 'Image not found'
      });
      return;
    }

    // Allow changing category and key to support carousel grouping
    // Multiple images can now have the same category-key combination
    
    // If a new file is uploaded, replace the old one
    if (file) {
      const oldFilePath = path.join(__dirname, '../../uploads', image.filename);
      
      // Delete old file
      try {
        await fs.unlink(oldFilePath);
      } catch (error) {
        console.warn('Old file not found on disk:', image.filename);
      }

      // Update with new file info
      const filename = file.filename;
      image.filename = filename;
      image.originalName = file.originalname;
      image.url = `/uploads/${filename}`;
      image.mimeType = file.mimetype;
      image.size = file.size;

      // Get image dimensions if it's an image
      try {
        const filePath = path.join(__dirname, '../../uploads', filename);
        const metadata = await sharp(filePath).metadata();
        image.width = metadata.width;
        image.height = metadata.height;
      } catch (error) {
        console.log('Could not get image dimensions:', error);
      }
    }

    // Update metadata fields including category and key for carousel grouping
    if (name !== undefined) image.name = name;
    if (description !== undefined) image.description = description;
    if (alt !== undefined) image.alt = alt;
    if (category !== undefined) image.category = category;
    if (key !== undefined) image.key = key;
    if (isActive !== undefined) image.isActive = isActive === 'true' || isActive === true;

    await image.save();

    res.status(200).json({
      success: true,
      message: 'Image updated successfully',
      data: image
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update image',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * List all uploaded images
 */
export const listImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, isActive } = req.query;

    const filter: any = {};
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const images = await Image.find(filter)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: images.length,
      data: images
    });
  } catch (error) {
    console.error('List error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list images',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
