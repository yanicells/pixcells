import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_ALBUMS_DIR = path.join(__dirname, 'public', 'albums');
const LIB_ALBUMS_DIR = path.join(__dirname, 'lib', 'albums');

// Image extensions to include
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.heif', '.JPG', '.JPEG', '.PNG', '.GIF', '.WEBP', '.HEIC', '.HEIF'];

/**
 * Get all image files from a directory (non-recursive, only direct children)
 */
function getImageFiles(dir) {
  const files = fs.readdirSync(dir);
  const images = [];

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    // Only include files (not subdirectories)
    if (stat.isFile()) {
      const ext = path.extname(file);
      if (IMAGE_EXTENSIONS.includes(ext)) {
        images.push(file);
      }
    }
  });

  // Sort alphabetically for consistent ordering
  return images.sort();
}

/**
 * Convert folder name to valid variable name
 */
function toVariableName(folderName) {
  // Remove special characters and convert to camelCase
  let cleaned = folderName.replace(/[^a-zA-Z0-9]/g, '');
  
  // If starts with a number, prefix with 'year'
  if (/^\d/.test(cleaned)) {
    return 'year' + cleaned.charAt(0).toLowerCase() + cleaned.slice(1);
  }
  
  // Otherwise just make first letter lowercase
  return cleaned.charAt(0).toLowerCase() + cleaned.slice(1);
}

/**
 * Generate TypeScript content for an album
 */
function generateAlbumTS(folderName, imageFiles, startId) {
  const variableName = toVariableName(folderName);
  
  let content = `export const ${variableName}Album = {\n`;
  content += `  album: [\n`;

  imageFiles.forEach((file, index) => {
    const id = startId + index;
    const url = `/albums/${folderName}/${file}`;
    content += `    { id: "${id}", url: "${url}" },\n`;
  });

  content += `  ],\n`;
  content += `};\n`;

  return content;
}

/**
 * Main function
 */
function main() {
  console.log('🔍 Scanning albums folder...\n');

  // Get all subdirectories in public/albums
  const folders = fs.readdirSync(PUBLIC_ALBUMS_DIR).filter(item => {
    const itemPath = path.join(PUBLIC_ALBUMS_DIR, item);
    return fs.statSync(itemPath).isDirectory();
  }).sort();

  if (folders.length === 0) {
    console.log('❌ No album folders found!');
    return;
  }

  console.log(`📁 Found ${folders.length} album folder(s):\n`);

  let currentId = 1000; // Starting ID
  const albumFiles = [];

  folders.forEach(folder => {
    const folderPath = path.join(PUBLIC_ALBUMS_DIR, folder);
    const images = getImageFiles(folderPath);

    if (images.length === 0) {
      console.log(`⏭️  Skipped: ${folder} (no images)`);
      return;
    }

    console.log(`✅ ${folder}: ${images.length} images (IDs ${currentId}-${currentId + images.length - 1})`);

    // Generate TypeScript content
    const tsContent = generateAlbumTS(folder, images, currentId);

    // Write to file
    const variableName = toVariableName(folder);
    const outputFile = path.join(LIB_ALBUMS_DIR, `${variableName}.ts`);
    fs.writeFileSync(outputFile, tsContent, 'utf8');

    albumFiles.push({
      folder,
      variableName,
      fileName: `${variableName}.ts`,
      imageCount: images.length,
    });

    currentId += images.length;
  });

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Generated ${albumFiles.length} album files in lib/albums/`);
  console.log('='.repeat(50));

  // Generate index file that exports all albums
  console.log('\n📝 Generating index file...');
  
  let indexContent = '// Auto-generated album exports\n\n';
  albumFiles.forEach(({ variableName, fileName }) => {
    indexContent += `export { ${variableName}Album } from './${variableName}';\n`;
  });

  const indexFile = path.join(LIB_ALBUMS_DIR, 'index.ts');
  fs.writeFileSync(indexFile, indexContent, 'utf8');

  console.log('✅ Generated lib/albums/index.ts');

  console.log('\n💡 You can now import albums like:');
  console.log(`   import { ${albumFiles[0]?.variableName}Album } from '@/lib/albums';`);
}

main().catch(console.error);

