import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========================================
// CONFIGURATION - FROM ENVIRONMENT VARIABLES
// ========================================
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.error('❌ Missing Cloudinary credentials!');
  console.error('Please create a .env.local file with:');
  console.error('  CLOUDINARY_CLOUD_NAME=your_cloud_name');
  console.error('  CLOUDINARY_API_KEY=your_api_key');
  console.error('  CLOUDINARY_API_SECRET=your_api_secret');
  process.exit(1);
}

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const ALBUMS_FOLDER = path.join(__dirname, 'public', 'albums');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.heif'];

// Track progress
let totalUploaded = 0;
let totalFailed = 0;
let totalSkipped = 0;

/**
 * Upload a single image to Cloudinary
 */
async function uploadImage(imagePath, cloudinaryPath) {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'albums',
      public_id: cloudinaryPath,
      overwrite: false, // Skip if already exists
      resource_type: 'auto',
    });

    console.log(`✅ Uploaded: ${cloudinaryPath}`);
    totalUploaded++;
    return result;
  } catch (error) {
    if (error.http_code === 400 && error.message.includes('already exists')) {
      console.log(`⏭️  Skipped (already exists): ${cloudinaryPath}`);
      totalSkipped++;
    } else {
      console.error(`❌ Failed: ${cloudinaryPath}`, error.message);
      totalFailed++;
    }
    return null;
  }
}

/**
 * Recursively find all images in a directory
 */
function findImages(dir) {
  const images = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      images.push(...findImages(fullPath));
    } else {
      const ext = path.extname(item).toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext)) {
        images.push(fullPath);
      }
    }
  }

  return images;
}

/**
 * Main upload function
 */
async function uploadAllImages() {
  console.log('🚀 Starting Cloudinary upload...\n');
  console.log(`📁 Source folder: ${ALBUMS_FOLDER}\n`);

  // Find all images
  const images = findImages(ALBUMS_FOLDER);
  console.log(`📸 Found ${images.length} images\n`);

  if (images.length === 0) {
    console.log('❌ No images found!');
    return;
  }

  // Upload each image
  let current = 0;
  for (const imagePath of images) {
    current++;
    
    // Create relative path for Cloudinary
    const relativePath = path.relative(ALBUMS_FOLDER, imagePath);
    const cloudinaryPath = relativePath.replace(/\\/g, '/').replace(/\.[^/.]+$/, ''); // Remove extension, normalize slashes
    
    console.log(`[${current}/${images.length}] Uploading: ${relativePath}`);
    
    await uploadImage(imagePath, cloudinaryPath);
    
    // Small delay to avoid rate limiting (free tier: 500 uploads/hour)
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 UPLOAD SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Uploaded:  ${totalUploaded}`);
  console.log(`⏭️  Skipped:   ${totalSkipped}`);
  console.log(`❌ Failed:    ${totalFailed}`);
  console.log(`📸 Total:     ${images.length}`);
  console.log('='.repeat(50));

  if (totalUploaded > 0 || totalSkipped > 0) {
    console.log('\n🎉 Next steps:');
    console.log('1. Run: node update-urls-to-cloudinary.mjs');
    console.log('2. Test your site locally');
    console.log('3. Push to GitHub & deploy to Vercel');
  }
}

// Check if config is set
if (cloudinary.config().cloud_name === 'YOUR_CLOUD_NAME') {
  console.error('❌ ERROR: Please update the configuration at the top of this file!');
  console.error('\n📝 Steps:');
  console.error('1. Go to: https://console.cloudinary.com/');
  console.error('2. Sign up or log in');
  console.error('3. Copy your Cloud Name, API Key, and API Secret');
  console.error('4. Update lines 11-13 in this file');
  console.error('5. Run this script again\n');
  process.exit(1);
}

// Run the upload
uploadAllImages().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});

