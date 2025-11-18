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

if (!CLOUD_NAME) {
  console.error('❌ Missing Cloudinary cloud name!');
  console.error('Please create a .env.local file with:');
  console.error('  CLOUDINARY_CLOUD_NAME=your_cloud_name');
  process.exit(1);
}

const LIB_ALBUMS_FOLDER = path.join(__dirname, 'lib', 'albums');

/**
 * Update URLs in a single album file
 */
function updateAlbumFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let updatedCount = 0;

    // Replace local URLs with Cloudinary URLs
    // Pattern: url: "/albums/... or url: '/albums/...
    const pattern = /(url:\s*["'])\/albums\/([^"']+)(["'])/g;
    
    content = content.replace(pattern, (match, prefix, imagePath, suffix) => {
      updatedCount++;
      const cloudinaryUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/albums/${imagePath}`;
      return `${prefix}${cloudinaryUrl}${suffix}`;
    });

    if (updatedCount > 0) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✅ Updated ${updatedCount} URLs in: ${path.basename(filePath)}`);
      return updatedCount;
    } else {
      console.log(`⏭️  No changes needed: ${path.basename(filePath)}`);
      return 0;
    }
  } catch (error) {
    console.error(`❌ Failed to update ${path.basename(filePath)}:`, error.message);
    return 0;
  }
}

/**
 * Main function
 */
function updateAllAlbumFiles() {
  console.log('🔄 Updating album URLs to Cloudinary...\n');
  console.log(`📁 Folder: ${LIB_ALBUMS_FOLDER}\n`);

  if (!fs.existsSync(LIB_ALBUMS_FOLDER)) {
    console.error('❌ lib/albums folder not found!');
    process.exit(1);
  }

  const files = fs.readdirSync(LIB_ALBUMS_FOLDER);
  const tsFiles = files.filter(f => f.endsWith('.ts'));

  if (tsFiles.length === 0) {
    console.log('❌ No .ts files found in lib/albums!');
    return;
  }

  let totalUpdated = 0;
  for (const file of tsFiles) {
    const filePath = path.join(LIB_ALBUMS_FOLDER, file);
    totalUpdated += updateAlbumFile(filePath);
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Total URLs updated: ${totalUpdated}`);
  console.log(`📄 Files processed: ${tsFiles.length}`);
  console.log('='.repeat(50));

  if (totalUpdated > 0) {
    console.log('\n🎉 Success! Your images now point to Cloudinary.');
    console.log('\n📝 Next steps:');
    console.log('1. Test locally: npm run dev');
    console.log('2. If everything works, push to GitHub');
    console.log('3. Deploy to Vercel');
    console.log('4. (Optional) Delete local public/albums/ folder to save space');
  }
}

// Check if config is set
if (CLOUD_NAME === 'YOUR_CLOUD_NAME') {
  console.error('❌ ERROR: Please update CLOUD_NAME at the top of this file!');
  console.error('\n📝 Use the same cloud name from upload-to-cloudinary.mjs\n');
  process.exit(1);
}

// Run the update
updateAllAlbumFiles();

