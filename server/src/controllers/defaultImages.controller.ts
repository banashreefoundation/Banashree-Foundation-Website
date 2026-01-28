import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import Image from '../models/Image';

/**
 * Import default images from the JSON file into the database
 */
export const importDefaultImages = async (req: Request, res: Response): Promise<void> => {
  try {
    // Read the default images JSON file
    const dataPath = path.join(__dirname, '../data/default-images.json');
    const fileContent = await fs.readFile(dataPath, 'utf-8');
    const defaultImages = JSON.parse(fileContent);

    if (!Array.isArray(defaultImages) || defaultImages.length === 0) {
      res.status(400).json({
        success: false,
        message: 'No default images found in the data file',
      });
      return;
    }

    // Check which images already exist (by filename and category)
    const existingImages = await Image.find({}).lean();
    const existingKeys = new Set(
      existingImages.map(img => `${img.filename}-${img.category}`)
    );

    // Filter out images that already exist
    const newImages = defaultImages.filter(
      (img: any) => !existingKeys.has(`${img.filename}-${img.category}`)
    );

    if (newImages.length === 0) {
      res.status(200).json({
        success: true,
        message: 'All default images already exist in the database',
        imported: 0,
        skipped: defaultImages.length,
      });
      return;
    }

    // Verify that the image files exist in uploads folder
    const uploadsDir = path.join(__dirname, '../../uploads');
    const missingFiles: string[] = [];
    
    for (const image of newImages) {
      const filePath = path.join(uploadsDir, image.filename);
      try {
        await fs.access(filePath);
      } catch {
        missingFiles.push(image.filename);
      }
    }

    if (missingFiles.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Some image files are missing from uploads folder',
        missingFiles,
      });
      return;
    }

    // Insert new images into database
    const result = await Image.insertMany(newImages);

    res.status(201).json({
      success: true,
      message: 'Default images imported successfully',
      imported: result.length,
      skipped: defaultImages.length - newImages.length,
      images: result,
    });
  } catch (error) {
    console.error('Error importing default images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import default images',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Get information about default images
 */
export const getDefaultImagesInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const dataPath = path.join(__dirname, '../data/default-images.json');
    const metadataPath = path.join(__dirname, '../data/default-images-metadata.json');

    // Check if files exist
    try {
      await fs.access(dataPath);
    } catch {
      res.status(404).json({
        success: false,
        message: 'Default images data file not found',
      });
      return;
    }

    // Read both files
    const fileContent = await fs.readFile(dataPath, 'utf-8');
    const defaultImages = JSON.parse(fileContent);

    let metadata = null;
    try {
      const metadataContent = await fs.readFile(metadataPath, 'utf-8');
      metadata = JSON.parse(metadataContent);
    } catch {
      // Metadata file doesn't exist, that's okay
    }

    // Check how many already exist in database
    const existingImages = await Image.find({}).lean();
    const existingKeys = new Set(
      existingImages.map(img => `${img.filename}-${img.category}`)
    );

    const alreadyImported = defaultImages.filter(
      (img: any) => existingKeys.has(`${img.filename}-${img.category}`)
    ).length;

    // Get list of images that can be imported
    const canImportList = defaultImages.filter(
      (img: any) => !existingKeys.has(`${img.filename}-${img.category}`)
    );

    // Get list of images that already exist
    const alreadyExistList = defaultImages.filter(
      (img: any) => existingKeys.has(`${img.filename}-${img.category}`)
    );

    res.status(200).json({
      success: true,
      totalDefaultImages: defaultImages.length,
      alreadyImported,
      canImport: canImportList.length,
      canImportList: canImportList.map((img: any) => ({
        name: img.name,
        filename: img.filename,
        category: img.category,
        size: img.size,
      })),
      alreadyExistList: alreadyExistList.map((img: any) => ({
        name: img.name,
        filename: img.filename,
        category: img.category,
      })),
      metadata,
    });
  } catch (error) {
    console.error('Error getting default images info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get default images information',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
