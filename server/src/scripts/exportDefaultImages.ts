import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import Image from '../models/Image';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/banashree';

async function exportDefaultImages() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');

    // Fetch all images from database
    const images = await Image.find({}).lean();
    console.log(`Found ${images.length} images in database`);

    // Prepare data for export (exclude MongoDB specific fields)
    const exportData = images.map(image => ({
      name: image.name,
      filename: image.filename,
      originalName: image.originalName,
      category: image.category,
      key: image.key,
      url: image.url,
      mimeType: image.mimeType,
      size: image.size,
      width: image.width,
      height: image.height,
      description: image.description,
      alt: image.alt,
      isActive: image.isActive,
    }));

    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, '../data');
    await fs.mkdir(dataDir, { recursive: true });

    // Write to JSON file
    const filePath = path.join(dataDir, 'default-images.json');
    await fs.writeFile(
      filePath,
      JSON.stringify(exportData, null, 2),
      'utf-8'
    );

    console.log(`Successfully exported ${exportData.length} images to ${filePath}`);
    
    // Also create a metadata file
    const metadataPath = path.join(dataDir, 'default-images-metadata.json');
    await fs.writeFile(
      metadataPath,
      JSON.stringify({
        exportDate: new Date().toISOString(),
        totalImages: exportData.length,
        categories: [...new Set(exportData.map(img => img.category))],
      }, null, 2),
      'utf-8'
    );

    console.log('Export completed successfully!');
  } catch (error) {
    console.error('Error exporting images:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the export
exportDefaultImages();
