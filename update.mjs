import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const ALBUMS_DIR = path.join(__dirname, "lib", "albums");
const RESULTS_FILE = path.join(__dirname, "uploadthing-results.json");

// Read upload results
function loadUploadResults() {
  if (!fs.existsSync(RESULTS_FILE)) {
    console.log(`❌ Upload results not found: ${RESULTS_FILE}`);
    console.log("\n💡 Run upload-to-uploadthing.mjs first!");
    process.exit(1);
  }

  const results = JSON.parse(fs.readFileSync(RESULTS_FILE, "utf8"));
  return results.uploaded;
}

// Create a mapping from filename to UploadThing URL
function createUrlMapping(uploadResults) {
  const mapping = {};

  uploadResults.forEach((result) => {
    // Extract just the filename from the path
    const filename = path.basename(result.fileName);
    mapping[filename] = {
      url: result.url,
      key: result.key,
      fullPath: result.fileName,
    };
  });

  return mapping;
}

// Update a single album file
function updateAlbumFile(filePath, urlMapping) {
  let content = fs.readFileSync(filePath, "utf8");
  let updatedCount = 0;

  // Match both url and full properties
  // Pattern: url: "https://res.cloudinary.com/.../filename.jpg"
  const urlPattern =
    /(url|full):\s*"https:\/\/res\.cloudinary\.com\/[^"]+\/([^/"]+\.(jpg|jpeg|png|webp|gif|bmp|JPG|JPEG|PNG|WEBP|GIF|BMP|HEIC|heic))"/gi;

  content = content.replace(urlPattern, (match, property, filename) => {
    const lowerFilename = filename.toLowerCase();
    const mapping = urlMapping[filename] || urlMapping[lowerFilename];

    if (mapping) {
      updatedCount++;
      // For 'url' property, add transformations; for 'full' property, use direct URL
      if (property === "url") {
        // Add query parameters for optimization (similar to Cloudinary)
        return `${property}: "${mapping.url}"`;
      } else {
        // Full quality URL
        return `${property}: "${mapping.url}"`;
      }
    }

    return match; // Keep original if no mapping found
  });

  if (updatedCount > 0) {
    fs.writeFileSync(filePath, content, "utf8");
  }

  return updatedCount;
}

// Main function
function main() {
  console.log("🔄 Updating album URLs to UploadThing...\n");

  // Load upload results
  const uploadResults = loadUploadResults();
  console.log(`📋 Loaded ${uploadResults.length} upload results\n`);

  // Create URL mapping
  const urlMapping = createUrlMapping(uploadResults);
  console.log(
    `🗺️  Created mapping for ${Object.keys(urlMapping).length} files\n`
  );

  // Get all TypeScript files in albums directory
  const albumFiles = fs
    .readdirSync(ALBUMS_DIR)
    .filter((file) => file.endsWith(".ts") && file !== "index.ts")
    .map((file) => path.join(ALBUMS_DIR, file));

  console.log(`📁 Found ${albumFiles.length} album files\n`);
  console.log("⏳ Updating URLs...\n");

  let totalUpdated = 0;
  const fileResults = [];

  albumFiles.forEach((filePath) => {
    const filename = path.basename(filePath);
    const count = updateAlbumFile(filePath, urlMapping);

    if (count > 0) {
      console.log(`✅ ${filename}: ${count} URLs updated`);
      fileResults.push({ file: filename, count });
      totalUpdated += count;
    } else {
      console.log(`⏭️  ${filename}: No URLs updated`);
    }
  });

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("📊 UPDATE SUMMARY");
  console.log("=".repeat(50));
  console.log(`📁 Files processed: ${albumFiles.length}`);
  console.log(`✅ Total URLs updated: ${totalUpdated}`);
  console.log("=".repeat(50));

  if (totalUpdated > 0) {
    console.log("\n✨ URL update complete!");
    console.log("\n📝 Next steps:");
    console.log("   1. Test locally: npm run dev");
    console.log("   2. Check if images load correctly");
    console.log("   3. Commit changes: git add lib/albums/");
    console.log("   4. Push and deploy");
  } else {
    console.log("\n⚠️  No URLs were updated!");
    console.log(
      "   - Check if upload-to-uploadthing.mjs completed successfully"
    );
    console.log("   - Verify uploadthing-results.json exists");
    console.log(
      "   - Ensure filenames match between local files and upload results"
    );
  }
}

main();
