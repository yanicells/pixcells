# 📸 Cloudinary Setup Guide

This guide will help you upload your images to Cloudinary and update your site to use them.

## 🚀 Step-by-Step Instructions

### **Step 1: Sign Up for Cloudinary**

1. Go to [https://cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
2. Sign up for a **free account**
3. After signing up, go to your [Console Dashboard](https://console.cloudinary.com/)

### **Step 2: Get Your Credentials**

On the dashboard, you'll see:

- **Cloud name**: `dxxxxx` (example)
- **API Key**: `123456789012345` (example)
- **API Secret**: `abcdefghijklmnopqrstuvwxyz` (example)

Copy these values.

### **Step 3: Configure Upload Script**

1. Open `upload-to-cloudinary.mjs`
2. Replace lines 11-13 with your actual values:
   ```javascript
   cloudinary.config({
     cloud_name: "dxxxxx", // Your cloud name
     api_key: "123456789012345", // Your API key
     api_secret: "abcdefghijklmnopqrst", // Your API secret
   });
   ```
3. Save the file

### **Step 4: Upload Images**

```bash
node upload-to-cloudinary.mjs
```

This will:

- ✅ Find all images in `public/albums/`
- ✅ Upload them to Cloudinary
- ✅ Skip duplicates automatically
- ⏱️ Take ~10-20 minutes for 2000+ images

**Note:** Free tier allows 500 uploads/hour. If you have 2000+ images, the script may take a few hours or you can pause and resume.

### **Step 5: Update Your Code**

1. Open `update-urls-to-cloudinary.mjs`
2. Replace line 12 with your cloud name:
   ```javascript
   const CLOUD_NAME = "dxxxxx"; // Your cloud name
   ```
3. Save and run:
   ```bash
   node update-urls-to-cloudinary.mjs
   ```

This will automatically update all URLs in `lib/albums/*.ts` from:

```typescript
url: "/albums/family/photo1.jpg";
```

to:

```typescript
url: "https://res.cloudinary.com/dxxxxx/image/upload/albums/family/photo1.jpg";
```

### **Step 6: Test Locally**

```bash
npm run dev
```

Open your browser and check:

- ✅ Images load correctly
- ✅ Carousels work
- ✅ Lightbox works
- ✅ Download button works

### **Step 7: Deploy**

```bash
git add .
git commit -m "Move images to Cloudinary"
git push
```

Vercel will automatically deploy! 🎉

## 📊 Free Tier Limits

- ✅ 25 GB storage
- ✅ 25 GB bandwidth/month
- ✅ 500 uploads/hour
- ✅ Unlimited transformations

More than enough for your memorial site!

## 🔄 Adding New Images Later

1. Add images to `public/albums/[album-name]/`
2. Run `node generate-albums.mjs` (to update album data)
3. Run `node upload-to-cloudinary.mjs` (uploads only new images)
4. Run `node update-urls-to-cloudinary.mjs` (updates URLs)
5. Test and deploy!

## 🗑️ Optional: Clean Up Local Images

After confirming everything works on production:

```bash
# Delete local images to save disk space
rm -rf public/albums/
```

Your Git repo will be much smaller, and all images will load from Cloudinary's CDN!

## ❓ Troubleshooting

### "already exists" errors

- This is normal! The script skips images already uploaded
- To re-upload, delete from Cloudinary console first

### Rate limit errors

- Free tier: 500 uploads/hour
- Just wait an hour and run the script again
- It will resume from where it left off

### Images not loading

- Check CLOUD_NAME is correct in the update script
- Check the Cloudinary console to confirm uploads
- Check browser console for 404 errors

## 📝 Notes

- Keep `upload-to-cloudinary.mjs` and `update-urls-to-cloudinary.mjs` in `.gitignore` to protect your API keys
- Never commit your API secret to Git
- The scripts are safe to run multiple times
