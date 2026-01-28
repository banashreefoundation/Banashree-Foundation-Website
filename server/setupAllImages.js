const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongodb:27017/banashree-foundation-db';

const ImageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  category: { type: String, required: true },
  key: { type: String, required: true },
  url: { type: String, required: true },
  mimeType: String,
  size: Number,
  width: Number,
  height: Number,
  description: String,
  alt: String,
  isActive: { type: Boolean, default: true },
  uploadedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Image = mongoose.model('Image', ImageSchema);

// Complete image configuration matching the old repository
const imageConfig = {
  header: {
    main: 'Group 10401@2x.png',
    program: 'Group 10416.png',
    line: 'Group 10373.svg'
  },
  logo: {
    main: 'Banashree Logo - Transparent@2x.png',
    loginLogo: 'login-logo-2x.png'
  },
  hero: {
    carousel: [
      'pexels_equalstock_20527519-1768314478661-780968461.png',
      'screenshot_2026_01_13_at_5_47_26___pm-1768313226333-599957873.png'
    ]
  },
  backgrounds: {
    children: 'Group 10375.png',
    groupBg: 'Group 10374.svg',
    greenBg: 'Group 10393.png',
    redBg: 'Group 10394.png',
    orangeBg: 'Group 10395.png'
  },
  empowerment: {
    woman: 'Group 10397.svg',
    education: 'Group 10347.svg',
    health: 'Group 10396.svg'
  },
  programs: {
    hero: 'screenshot_2026_01_14_at_5_24_44___pm-1768395111279-121653555.png',
    animalWelfare: 'pexels-pranidchakan-boonrom-101111-1350563.png',
    elderCare: 'pexels-kampus-7551581@2x.png',
    childCare: 'pexels-rebecca-zaal-252062-764681.png',
    farmerEmpowerment: 'pexels-equalstock-20527519.png',
    communityBuilding: 'pexels-ahmed-akacha-3313934-9993428.png',
    waterConservation: 'pexels-shally-imagery-473875988-30224434@2x.png'
  },
  projects: {
    hero: 'screenshot_2026_01_14_at_5_25_16___pm-1768395232779-341630304.png',
    goshala: 'pexels-leah-newhouse-50725-1449656.png',
    waterProject: 'pexels-shally-imagery-473875988-30224434.png'
  },
  events: {
    hero: 'screenshot_2026_01_14_at_5_24_44___pm-1768395283980-146661571.png',
    default1: 'pexels-kampus-7551581@2x.png',
    default2: 'pexels-rebecca-zaal-252062-764681.png',
    default3: 'pexels-equalstock-20356942.png'
  },
  campaigns: {
    hero: 'campaigns_hero-1768401589815-315054442.svg'
  },
  other: {
    barCode: 'bar_code.png',
    hubliNews: 'hubli_news.jpg',
    smallGirl: 'Group 10316@2x.png',
    boyHands: 'group-1768306845568-910988058.png'
  }
};

async function setupImages() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing images
    await Image.deleteMany({});
    console.log('🗑️  Cleared existing images');
    
    let added = 0;
    
    // Process each category
    for (const [category, images] of Object.entries(imageConfig)) {
      console.log(`\n📂 Processing category: ${category}`);
      
      for (const [key, value] of Object.entries(images)) {
        // Handle array of images (like hero carousel)
        const filenames = Array.isArray(value) ? value : [value];
        
        for (const filename of filenames) {
          try {
            const ext = filename.split('.').pop().toLowerCase();
            
            await Image.create({
              name: `${category} ${key}`,
              filename: filename,
              originalName: filename,
              category: category,
              key: key,
              url: `/uploads/${filename}`,
              mimeType: `image/${ext === 'svg' ? 'svg+xml' : ext === 'jpg' ? 'jpeg' : ext}`,
              description: `${category} - ${key}`,
              alt: `${category} ${key}`,
              isActive: true
            });
            
            console.log(`✅ Added: ${category}/${key} -> ${filename}`);
            added++;
          } catch (err) {
            console.log(`❌ Error adding ${category}/${key}:`, err.message);
          }
        }
      }
    }
    
    console.log(`\n📊 Summary: Added ${added} images with proper category/key structure`);
    
    await mongoose.disconnect();
    console.log('\n✨ Done!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setupImages();
