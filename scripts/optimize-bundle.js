#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📊 Starting bundle size optimization...');

// Function to get bundle size before optimization
const getBundleSize = () => {
  try {
    // Build and capture output
    const buildOutput = execSync('npm run build', { 
      encoding: 'utf8', 
      stdio: 'pipe',
      maxBuffer: 1024 * 1024 * 10 
    });
    
    // Extract size information from build output
    const sizeMatch = buildOutput.match(/entrypoint.*?\(([\d.]+)\s*MiB\)/i);
    const currentSize = sizeMatch ? parseFloat(sizeMatch[1]) : null;
    
    console.log(`📏 Current bundle size: ${currentSize}MB`);
    return currentSize;
  } catch (error) {
    console.error('❌ Error getting bundle size:', error.message);
    return null;
  }
};

// Function to remove large unused dependencies
const optimizeDependencies = () => {
  console.log('🔧 Checking for unused dependencies...');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Dependencies that might be causing bloat
  const potentiallyUnusedDeps = [
    '@vercel/analytics' // Large analytics package - consider removing if not used
  ];
  
  let changed = false;
  potentiallyUnusedDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      console.log(`⚠️  Found potentially unused dependency: ${dep}`);
      // We won't automatically remove it, just warn
    }
  });
  
  return changed;
};

// Function to create preload directives for critical resources
const generatePreloadHints = () => {
  console.log('🚀 Generating preload hints...');
  
  const buildPath = path.join(process.cwd(), 'build');
  const indexPath = path.join(buildPath, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.log('❌ Build not found. Run npm run build first.');
    return false;
  }
  
  try {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Add preload hints for critical resources
    const preloadHints = [
      '<link rel="preload" href="/static/css/main.css" as="style" crossorigin>',
      '<link rel="preload" href="/static/js/main.js" as="script" crossorigin>',
      '<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>',
      '<link rel="dns-prefetch" href="https://fonts.gstatic.com" crossorigin>'
    ];
    
    // Insert preload hints before closing head tag
    const headCloseIndex = indexContent.indexOf('</head>');
    if (headCloseIndex !== -1) {
      const beforeHead = indexContent.substring(0, headCloseIndex);
      const afterHead = indexContent.substring(headCloseIndex);
      
      indexContent = beforeHead + '  ' + preloadHints.join('\n  ') + '\n' + afterHead;
      fs.writeFileSync(indexPath, indexContent);
      console.log('✅ Added preload hints to index.html');
      return true;
    }
  } catch (error) {
    console.log('⚠️  Could not add preload hints:', error.message);
  }
  
  return false;
};

// Function to optimize images and assets
const optimizeAssets = () => {
  console.log('🖼️  Optimizing static assets...');
  
  const publicPath = path.join(process.cwd(), 'public');
  const buildPath = path.join(process.cwd(), 'build/static');
  
  // Check for large assets that could be optimized
  const checkAssetSizes = (dir) => {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    files.forEach(file => {
      const filePath = path.join(dir, file.name);
      
      if (file.isDirectory()) {
        checkAssetSizes(filePath);
      } else if (file.isFile()) {
        const stats = fs.statSync(filePath);
        const sizeInMB = stats.size / (1024 * 1024);
        
        if (sizeInMB > 0.5) { // Files larger than 500KB
          console.log(`📦 Large asset detected: ${path.relative(process.cwd(), filePath)} (${sizeInMB.toFixed(2)}MB)`);
          
          if (file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
            console.log(`   💡 Consider optimizing this image or using WebP format`);
          }
        }
      }
    });
  };
  
  checkAssetSizes(publicPath);
  if (fs.existsSync(buildPath)) {
    checkAssetSizes(buildPath);
  }
};

// Function to analyze webpack bundle
const analyzeBundle = () => {
  console.log('📊 Analyzing webpack bundle...');
  
  try {
    // Run bundle analyzer
    process.env.ANALYZE = 'true';
    console.log('   🔍 Running bundle analysis (this may take a moment)...');
    console.log('   📖 Bundle analyzer will open in your browser');
    console.log('   ⏱️  Press Ctrl+C after reviewing the bundle analysis');
    
    execSync('npm run build', { stdio: 'inherit' });
    
  } catch (error) {
    console.log('⚠️  Bundle analysis completed or interrupted');
  } finally {
    delete process.env.ANALYZE;
  }
};

// Main optimization function
const main = async () => {
  console.log('🎯 Data Structure Visualizer Bundle Optimization');
  console.log('================================================\n');
  
  // Get initial bundle size
  const initialSize = getBundleSize();
  
  // Optimize dependencies
  optimizeDependencies();
  
  // Optimize assets
  optimizeAssets();
  
  // Generate preload hints
  generatePreloadHints();
  
  // Get final bundle size
  console.log('\n📈 Optimization complete!');
  
  // Offer to run bundle analyzer
  console.log('\n🔍 Would you like to analyze the bundle composition?');
  console.log('   Run: ANALYZE=true npm run build');
  console.log('   Or: node scripts/optimize-bundle.js --analyze');
  
  if (process.argv.includes('--analyze')) {
    console.log('\n📊 Starting bundle analysis...');
    analyzeBundle();
  }
  
  console.log('\n💡 Additional optimization suggestions:');
  console.log('   • Consider implementing route-based code splitting');
  console.log('   • Use dynamic imports for heavy components');
  console.log('   • Enable gzip/brotli compression on your server');
  console.log('   • Consider using a CDN for static assets');
  console.log('   • Implement service worker for caching');
};

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { getBundleSize, optimizeDependencies, generatePreloadHints, optimizeAssets };
