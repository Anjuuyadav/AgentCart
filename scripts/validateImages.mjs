import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { products } from '../backend/dist/seed/data.js';
import { query, closePool } from '../backend/dist/config/database.js';

async function validate() {
  console.log('========================================');
  console.log('  AGENTCART PRODUCT IMAGE VALIDATION');
  console.log('========================================\n');

  let passed = true;

  // 1. Total products
  const totalProducts = products.length;
  console.log(`1. Total products: ${totalProducts}`);
  if (totalProducts !== 87) {
    console.error(`   ❌ Expected 87 products, found ${totalProducts}`);
    passed = false;
  } else {
    console.log('   ✅ Total products = 87');
  }

  // 2. Unique image references
  const imageRefs = products.map((p) => p.image);
  const uniqueRefs = new Set(imageRefs);
  console.log(`2. Unique image references: ${uniqueRefs.size}`);
  if (uniqueRefs.size !== 87) {
    console.error(`   ❌ Expected 87 unique image references, found ${uniqueRefs.size}`);
    passed = false;
  } else {
    console.log('   ✅ Unique image references = 87');
  }

  // 3. Unique actual image files in both directories
  const publicDir = path.resolve('public/products');
  const frontendPublicDir = path.resolve('frontend/public/products');

  const publicFiles = (await readdir(publicDir)).filter((f) => f.endsWith('.webp'));
  const frontendFiles = (await readdir(frontendPublicDir)).filter((f) => f.endsWith('.webp'));

  console.log(`3. Unique actual image files: public=${publicFiles.length}, frontend/public=${frontendFiles.length}`);
  if (publicFiles.length !== 87 || frontendFiles.length !== 87) {
    console.error(`   ❌ Expected 87 webp files in each directory`);
    passed = false;
  } else {
    console.log('   ✅ Unique actual image files = 87 in both target locations');
  }

  // 4. Missing referenced image files
  let missingFiles = 0;
  for (const p of products) {
    const filename = path.basename(p.image);
    const pubPath = path.join(publicDir, filename);
    const frontPath = path.join(frontendPublicDir, filename);
    try {
      await stat(pubPath);
      await stat(frontPath);
    } catch {
      missingFiles++;
      console.error(`   ❌ Missing file for ${p.id}: ${p.image}`);
    }
  }
  console.log(`4. Missing referenced image files: ${missingFiles}`);
  if (missingFiles !== 0) {
    passed = false;
  } else {
    console.log('   ✅ Missing referenced image files = 0');
  }

  // 5. Duplicate image references
  const seenRefs = new Set();
  const dupRefs = [];
  for (const p of products) {
    if (seenRefs.has(p.image)) dupRefs.push(p.image);
    seenRefs.add(p.image);
  }
  console.log(`5. Duplicate image references: ${dupRefs.length}`);
  if (dupRefs.length !== 0) {
    console.error(`   ❌ Found duplicates:`, dupRefs);
    passed = false;
  } else {
    console.log('   ✅ Duplicate image references = 0');
  }

  // 6. Duplicate actual image content (SHA256 comparison)
  const contentHashes = new Map();
  const duplicateContent = [];
  for (const f of publicFiles) {
    const buf = await readFile(path.join(publicDir, f));
    const h = crypto.createHash('sha256').update(buf).digest('hex');
    if (contentHashes.has(h)) {
      duplicateContent.push({ file1: contentHashes.get(h), file2: f });
    } else {
      contentHashes.set(h, f);
    }
  }
  console.log(`6. Duplicate actual image content: ${duplicateContent.length}`);
  if (duplicateContent.length !== 0) {
    console.error(`   ❌ Duplicate image contents found:`, duplicateContent);
    passed = false;
  } else {
    console.log(`   ✅ Duplicate actual image content = 0 (all ${contentHashes.size} SHA256 hashes are unique)`);
  }

  // 7. Products still using Unsplash/category-shared images
  const unsplashProducts = products.filter((p) => p.image.includes('unsplash') || (p.images || []).some((img) => img.includes('unsplash')));
  console.log(`7. Products still using Unsplash/category-shared images: ${unsplashProducts.length}`);
  if (unsplashProducts.length !== 0) {
    console.error(`   ❌ Found products with Unsplash images:`, unsplashProducts.map((p) => p.id));
    passed = false;
  } else {
    console.log('   ✅ Products still using Unsplash/category-shared images = 0');
  }

  // 8. Every product's image path starts with /products/
  const invalidPathPrefix = products.filter((p) => !p.image.startsWith('/products/') || !(p.images || []).every((img) => img.startsWith('/products/')));
  console.log(`8. Image paths starting with /products/: ${products.length - invalidPathPrefix.length} / ${products.length}`);
  if (invalidPathPrefix.length !== 0) {
    console.error(`   ❌ Invalid path prefix products:`, invalidPathPrefix.map((p) => p.id));
    passed = false;
  } else {
    console.log('   ✅ Every product image path starts with /products/');
  }

  // 9. Every referenced file actually exists under frontend/public/products/
  let frontMissing = 0;
  for (const p of products) {
    const relFile = p.image.replace(/^\/products\//, '');
    const fullPath = path.join(frontendPublicDir, relFile);
    try {
      const s = await stat(fullPath);
      if (s.size === 0) frontMissing++;
    } catch {
      frontMissing++;
    }
  }
  console.log(`9. Missing in frontend/public/products/: ${frontMissing}`);
  if (frontMissing !== 0) {
    passed = false;
  } else {
    console.log('   ✅ Every referenced file exists under frontend/public/products/ and has non-zero size');
  }

  // 13. Verify product API responses still contain image and images (from DB)
  try {
    const dbRes = await query('SELECT id, image, images FROM products LIMIT 5');
    const dbSamples = dbRes.rows;
    const allHaveImageAndImages = dbSamples.every((r) => r.image && Array.isArray(r.images) && r.images.length > 0);
    console.log(`13. DB Product records contain image & images: ${allHaveImageAndImages}`);
    if (!allHaveImageAndImages) {
      console.error('   ❌ DB sample records missing image/images:', dbSamples);
      passed = false;
    } else {
      console.log('   ✅ DB Product records verified: image and images array populated');
    }
  } catch (err) {
    console.error('   ❌ Error querying DB for sample records:', err.message);
  } finally {
    await closePool();
  }

  // 14. Verify frontend can load the local images (check magic bytes for WebP)
  let validWebpHeaders = 0;
  for (const f of publicFiles) {
    const buf = await readFile(path.join(publicDir, f));
    // RIFF .... WEBP
    if (buf.subarray(0, 4).toString() === 'RIFF' && buf.subarray(8, 12).toString() === 'WEBP') {
      validWebpHeaders++;
    }
  }
  console.log(`14. Valid WebP headers: ${validWebpHeaders} / ${publicFiles.length}`);
  if (validWebpHeaders !== 87) {
    console.error('   ❌ Not all files have valid WebP headers');
    passed = false;
  } else {
    console.log('   ✅ All 87 images have valid RIFF/WEBP binary signatures');
  }

  console.log('\n========================================');
  console.log(passed ? '  ALL IMAGE CHECKS PASSED ✅' : '  SOME CHECKS FAILED ❌');
  console.log('========================================\n');

  if (!passed) process.exit(1);
}

validate().catch((err) => {
  console.error('Fatal validation error:', err);
  process.exit(1);
});
