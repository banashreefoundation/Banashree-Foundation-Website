import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import sharp from 'sharp';
import Image from '../models/Image';

// Load images.json config
const imagesConfig = {
  "defaults": {
    "placeholder": "/images/placeholder.svg",
    "avatar": "/images/avatar-placeholder.svg",
    "logo": "/images/Banashree-Logo.png",
    "program": "/images/program-placeholder.svg",
    "project": "/images/project-placeholder.svg",
    "event": "/images/event-placeholder.svg"
  },
  "header": {
    "main": "Group 10401@2x.png",
    "program": "Group 10416.png",
    "line": "Group 10373.svg"
  },
  "logo": {
    "main": "Banashree Logo - Transparent@2x.png",
    "loginLogo": "login-logo-2x.png"
  },
  "backgrounds": {
    "children": "Group 10375.png",
    "groupBg": "Group 10374.svg",
    "rectBg": "Rectangle 6753.svg",
    "greenBg": "Group 10393.png",
    "redBg": "Group 10394.png",
    "orangeBg": "Group 10395.png"
  },
  "empowerment": {
    "woman": "Group 10397.svg",
    "education": "Group 10347.svg",
    "health": "Group 10396.svg"
  },
  "programs": {
    "animalWelfare": "pexels-pranidchakan-boonrom-101111-1350563.png",
    "elderCare": "pexels-kampus-7551581@2x.png",
    "childCare": "pexels-rebecca-zaal-252062-764681.png",
    "farmerEmpowerment": "pexels-equalstock-20527519.png",
    "communityBuilding": "pexels-ahmed-akacha-3313934-9993428.png",
    "waterConservation": "pexels-shally-imagery-473875988-30224434@2x.png"
  },
  "projects": {
    "goshala": "pexels-leah-newhouse-50725-1449656.png",
    "waterProject": "pexels-shally-imagery-473875988-30224434.png"
  },
  "events": {
    "default1": "pexels-kampus-7551581@2x.png",
    "default2": "pexels-rebecca-zaal-252062-764681.png",
    "default3": "pexels-equalstock-20356942.png"
  },
  "other": {
    "barCode": "bar_code.png",
    "hubliNews": "hubli_news.jpg",
    "smallGirl": "Group 10316@2x.png",
    "boyHands": "Image 44@2x.png",
    "userBackground": "user_background.png"
  }
};

const SOURCE_DIR = path.join(__dirname, '../../../client/src/assets/images');
const DEST_DIR = path.join(__dirname, '../../uploads');
// Use localhost:27017 when running from host, mongodb:27017 when running in container
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/banashree-foundation-db';

async function getImageDimensions(filePath: string): Promise<{ width?: number; height?: number }> {
  try {
    const metadata = await sharp(filePath).metadata();
    return { width: metadata.width, height: metadata.height };
  } catch (error) {
    console.log(`Could not get dimensions for ${filePath}`);
    return {};
  }
}

async function copyImage(filename: string): Promise<{ success: boolean; destPath?: string; size?: number }> {
  try {
    const sourcePath = path.join(SOURCE_DIR, filename);
    const destPath = path.join(DEST_DIR, filename);

    // Check if source file exists
    try {
      await fs.access(sourcePath);
    } catch {
      console.log(`⚠️  Source file not found: ${filename}`);
      return { success: false };
    }

    // Copy file
    await fs.copyFile(sourcePath, destPath);
    
    // Get file size
    const stats = await fs.stat(destPath);
    
    console.log(`✅ Copied: ${filename}`);
    return { success: true, destPath, size: stats.size };
  } catch (error) {
    console.error(`❌ Error copying ${filename}:`, error);
    return { success: false };
  }
}

async function migrateImages() {
  try {
    console.log('🚀 Starting image migration...\n');

    // Connect to MongoDB
    console.log('📦 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URL);
    console.log('✅ Connected to MongoDB\n');

    // Ensure uploads directory exists
    await fs.mkdir(DEST_DIR, { recursive: true });
    console.log('📁 Uploads directory ready\n');

    let successCount = 0;
    let failCount = 0;
    let skippedCount = 0;

    // Process each category
    for (const [category, images] of Object.entries(imagesConfig)) {
      console.log(`\n📂 Processing category: ${category}`);
      
      if (typeof images !== 'object') continue;

      for (const [key, filename] of Object.entries(images)) {
        if (typeof filename !== 'string') continue;

        // Skip placeholder paths
        if (filename.startsWith('/images/')) {
          console.log(`⏭️  Skipping placeholder: ${filename}`);
          skippedCount++;
          continue;
        }

        // Check if image already exists in database
        const existing = await Image.findOne({ category, key });
        if (existing) {
          console.log(`⏭️  Already exists: ${category}/${key} -> ${filename}`);
          skippedCount++;
          continue;
        }

        // Check if filename already exists (same file used in different categories)
        const existingFile = await Image.findOne({ filename });
        if (existingFile) {
          console.log(`ℹ️  File already in DB (${existingFile.category}/${existingFile.key}), creating reference: ${category}/${key}`);
          // Create a new entry that references the same file
          const imageDoc = new Image({
            name: key.replace(/([A-Z])/g, ' $1').trim(),
            filename: filename,
            originalName: filename,
            category: category,
            key: key,
            url: `/uploads/${filename}`,
            mimeType: existingFile.mimeType,
            size: existingFile.size,
            width: existingFile.width,
            height: existingFile.height,
            description: `${category} - ${key}`,
            alt: `${category} ${key}`,
            isActive: true,
          });
          await imageDoc.save();
          console.log(`✅ Created reference in DB: ${category}/${key}`);
          successCount++;
          continue;
        }

        // Copy image file
        const copyResult = await copyImage(filename);
        
        if (!copyResult.success || !copyResult.destPath) {
          failCount++;
          continue;
        }

        // Get image dimensions
        const dimensions = await getImageDimensions(copyResult.destPath);

        // Determine MIME type
        const ext = path.extname(filename).toLowerCase();
        let mimeType = 'image/jpeg';
        if (ext === '.png') mimeType = 'image/png';
        else if (ext === '.svg') mimeType = 'image/svg+xml';
        else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
        else if (ext === '.gif') mimeType = 'image/gif';
        else if (ext === '.webp') mimeType = 'image/webp';

        // Create database entry
        const imageDoc = new Image({
          name: key.replace(/([A-Z])/g, ' $1').trim(), // Convert camelCase to readable name
          filename: filename,
          originalName: filename,
          category: category,
          key: key,
          url: `/uploads/${filename}`,
          mimeType: mimeType,
          size: copyResult.size || 0,
          width: dimensions.width,
          height: dimensions.height,
          description: `${category} - ${key}`,
          alt: `${category} ${key}`,
          isActive: true,
        });

        await imageDoc.save();
        console.log(`✅ Saved to DB: ${category}/${key}`);
        successCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Migration Summary:');
    console.log(`   ✅ Successfully migrated: ${successCount}`);
    console.log(`   ⏭️  Skipped: ${skippedCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log('='.repeat(60));

    console.log('\n✨ Migration completed!\n');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run migration
migrateImages();
