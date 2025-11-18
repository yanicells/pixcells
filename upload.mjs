import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { UTApi } from "uploadthing/server";
import { config } from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
config({ path: path.join(__dirname, ".env.local") });

// Configuration
const ALBUMS_DIR = path.join(__dirname, "public", "pitiks");
const BATCH_SIZE = 10; // Upload 10 files at a time
const DELAY_BETWEEN_BATCHES = 2000; // 2 seconds delay

// Initialize UploadThing API
const utapi = new UTApi({
  token: process.env.UPLOADTHING_TOKEN,
});

// Supported image formats
const SUPPORTED_FORMATS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp"];

// Get all image files recursively
function getAllImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllImageFiles(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (SUPPORTED_FORMATS.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

// Get relative path for storing in UploadThing with album structure
function getRelativePath(filePath) {
  const relativePath = path.relative(ALBUMS_DIR, filePath);
  return relativePath.replace(/\\/g, "/"); // Convert Windows paths to forward slashes
}

// Upload a batch of files
async function uploadBatch(files) {
  const uploadPromises = files.map(async (filePath) => {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const fileName = getRelativePath(filePath);
      const ext = path.extname(filePath).toLowerCase();

      // Determine MIME type
      const mimeTypes = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".gif": "image/gif",
        ".bmp": "image/bmp",
      };

      // Create a File-like object
      const blob = new Blob([fileBuffer], { type: mimeTypes[ext] });
      const file = new File([blob], fileName, { type: mimeTypes[ext] });

      return { file, originalPath: filePath, fileName };
    } catch (error) {
      console.log(`❌ Failed to prepare: ${path.basename(filePath)}`);
      console.log(`   Error: ${error.message}`);
      return null;
    }
  });

  const preparedFiles = (await Promise.all(uploadPromises)).filter(Boolean);

  if (preparedFiles.length === 0) {
    return [];
  }

  try {
    const results = await utapi.uploadFiles(preparedFiles.map((f) => f.file));

    return results.map((result, index) => {
      const { fileName, originalPath } = preparedFiles[index];

      if (result.data) {
        console.log(`✅ Uploaded: ${fileName}`);
        console.log(`   URL: ${result.data.url}`);
        return {
          success: true,
          fileName,
          originalPath,
          url: result.data.url,
          key: result.data.key,
        };
      } else {
        console.log(`❌ Failed: ${fileName}`);
        console.log(`   Error: ${result.error?.message || "Unknown error"}`);
        return {
          success: false,
          fileName,
          originalPath,
          error: result.error,
        };
      }
    });
  } catch (error) {
    console.log(`❌ Batch upload failed: ${error.message}`);
    return preparedFiles.map((f) => ({
      success: false,
      fileName: f.fileName,
      originalPath: f.originalPath,
      error: error.message,
    }));
  }
}

// Main upload function
async function main() {
  console.log("🚀 Starting UploadThing bulk upload...\n");

  if (!process.env.UPLOADTHING_TOKEN) {
    console.log("❌ Error: UPLOADTHING_TOKEN not found in .env.local");
    console.log("\n💡 Steps to fix:");
    console.log("   1. Go to https://uploadthing.com/dashboard");
    console.log("   2. Create a new application or use existing");
    console.log("   3. Copy your token from API Keys tab");
    console.log(
      "   4. Add it to .env.local: UPLOADTHING_TOKEN=your_token_here"
    );
    process.exit(1);
  }

  if (!fs.existsSync(ALBUMS_DIR)) {
    console.log(`❌ Albums directory not found: ${ALBUMS_DIR}`);
    process.exit(1);
  }

  console.log(`📁 Scanning: ${ALBUMS_DIR}\n`);
  const allFiles = getAllImageFiles(ALBUMS_DIR);

  if (allFiles.length === 0) {
    console.log("✨ No images found to upload!");
    return;
  }

  console.log(`📸 Found ${allFiles.length} images`);
  console.log(`⚙️  Uploading in batches of ${BATCH_SIZE}`);
  console.log(
    `⏱️  ${Math.ceil(allFiles.length / BATCH_SIZE)} batches estimated\n`
  );
  console.log("⏳ Starting upload...\n");

  const results = {
    uploaded: [],
    failed: [],
  };

  // Process in batches
  for (let i = 0; i < allFiles.length; i += BATCH_SIZE) {
    const batch = allFiles.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(allFiles.length / BATCH_SIZE);

    console.log(
      `\n📦 Batch ${batchNumber}/${totalBatches} (${batch.length} files)`
    );
    console.log("─".repeat(50));

    const batchResults = await uploadBatch(batch);

    batchResults.forEach((result) => {
      if (result.success) {
        results.uploaded.push(result);
      } else {
        results.failed.push(result);
      }
    });

    // Delay between batches to avoid rate limiting
    if (i + BATCH_SIZE < allFiles.length) {
      console.log(
        `\n⏸️  Waiting ${DELAY_BETWEEN_BATCHES / 1000}s before next batch...`
      );
      await new Promise((resolve) =>
        setTimeout(resolve, DELAY_BETWEEN_BATCHES)
      );
    }
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("📊 UPLOAD SUMMARY");
  console.log("=".repeat(50));
  console.log(`✅ Uploaded: ${results.uploaded.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`📁 Total: ${allFiles.length}`);
  console.log("=".repeat(50));

  // Save upload results to JSON file
  const outputFile = path.join(__dirname, "uploadthing-results.json");
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`\n💾 Results saved to: ${outputFile}`);

  if (results.failed.length > 0) {
    console.log("\n❌ Failed uploads:");
    results.failed.forEach((f) => {
      console.log(`   - ${f.fileName}`);
      console.log(`     ${f.error?.message || f.error || "Unknown error"}`);
    });
  }

  console.log("\n✨ Upload complete!");
  console.log("\n📝 Next steps:");
  console.log("   1. Run: node update-urls-to-uploadthing.mjs");
  console.log("   2. Test your images locally");
  console.log("   3. Commit and deploy");
}

main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
