const fs = require('fs');
const path = require('path');
const { gzipSize } = require('gzip-size');

/**
 * Bundle analysis script that provides detailed insights into bundle size and optimization opportunities
 */

class BundleAnalyzer {
  constructor(buildDir = 'build') {
    this.buildDir = buildDir;
    this.staticDir = path.join(buildDir, 'static');
  }

  async analyze() {
    console.log('🔍 Analyzing bundle...\n');
    
    if (!fs.existsSync(this.buildDir)) {
      console.error('❌ Build directory not found. Please run "npm run build" first.');
      return;
    }

    const stats = await this.gatherStats();
    this.printResults(stats);
  }

  async gatherStats() {
    const jsDir = path.join(this.staticDir, 'js');
    const cssDir = path.join(this.staticDir, 'css');
    
    const stats = {
      js: { files: [], totalSize: 0, totalGzipSize: 0 },
      css: { files: [], totalSize: 0, totalGzipSize: 0 },
      other: { files: [], totalSize: 0 },
      total: { size: 0, gzipSize: 0 }
    };

    // Analyze JavaScript files
    if (fs.existsSync(jsDir)) {
      const jsFiles = fs.readdirSync(jsDir).filter(file => file.endsWith('.js'));
      for (const file of jsFiles) {
        const filePath = path.join(jsDir, file);
        const fileSize = fs.statSync(filePath).size;
        const fileContent = fs.readFileSync(filePath);
        const gzipFileSize = await gzipSize(fileContent);
        
        stats.js.files.push({
          name: file,
          size: fileSize,
          gzipSize: gzipFileSize
        });
        
        stats.js.totalSize += fileSize;
        stats.js.totalGzipSize += gzipFileSize;
      }
    }

    // Analyze CSS files
    if (fs.existsSync(cssDir)) {
      const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));
      for (const file of cssFiles) {
        const filePath = path.join(cssDir, file);
        const fileSize = fs.statSync(filePath).size;
        const fileContent = fs.readFileSync(filePath);
        const gzipFileSize = await gzipSize(fileContent);
        
        stats.css.files.push({
          name: file,
          size: fileSize,
          gzipSize: gzipFileSize
        });
        
        stats.css.totalSize += fileSize;
        stats.css.totalGzipSize += gzipFileSize;
      }
    }

    // Calculate totals
    stats.total.size = stats.js.totalSize + stats.css.totalSize;
    stats.total.gzipSize = stats.js.totalGzipSize + stats.css.totalGzipSize;

    return stats;
  }

  printResults(stats) {
    const formatSize = (bytes) => {
      const kb = bytes / 1024;
      const mb = kb / 1024;
      if (mb >= 1) return `${mb.toFixed(2)} MB`;
      return `${kb.toFixed(2)} KB`;
    };

    const getCompressionRatio = (size, gzipSize) => {
      return ((1 - gzipSize / size) * 100).toFixed(1);
    };

    console.log('📊 Bundle Analysis Results');
    console.log('='.repeat(50));
    
    // JavaScript files
    console.log('\n🟨 JavaScript Files:');
    console.log('-'.repeat(30));
    stats.js.files
      .sort((a, b) => b.size - a.size)
      .forEach(file => {
        const compressionRatio = getCompressionRatio(file.size, file.gzipSize);
        console.log(`📄 ${file.name}`);
        console.log(`   Size: ${formatSize(file.size)} | Gzipped: ${formatSize(file.gzipSize)} (${compressionRatio}% compression)`);
      });
    
    console.log(`\n   Total JS: ${formatSize(stats.js.totalSize)} | Gzipped: ${formatSize(stats.js.totalGzipSize)}`);

    // CSS files
    console.log('\n🟦 CSS Files:');
    console.log('-'.repeat(30));
    stats.css.files
      .sort((a, b) => b.size - a.size)
      .forEach(file => {
        const compressionRatio = getCompressionRatio(file.size, file.gzipSize);
        console.log(`📄 ${file.name}`);
        console.log(`   Size: ${formatSize(file.size)} | Gzipped: ${formatSize(file.gzipSize)} (${compressionRatio}% compression)`);
      });
    
    console.log(`\n   Total CSS: ${formatSize(stats.css.totalSize)} | Gzipped: ${formatSize(stats.css.totalGzipSize)}`);

    // Total summary
    console.log('\n🎯 Total Bundle Size:');
    console.log('-'.repeat(30));
    console.log(`   Uncompressed: ${formatSize(stats.total.size)}`);
    console.log(`   Gzipped: ${formatSize(stats.total.gzipSize)}`);
    console.log(`   Compression Ratio: ${getCompressionRatio(stats.total.size, stats.total.gzipSize)}%`);

    // Recommendations
    console.log('\n💡 Optimization Recommendations:');
    console.log('-'.repeat(40));
    
    const largeJSFiles = stats.js.files.filter(file => file.size > 300000);
    if (largeJSFiles.length > 0) {
      console.log('⚠️  Large JS files detected (>300KB):');
      largeJSFiles.forEach(file => {
        console.log(`   - ${file.name}: Consider code splitting or lazy loading`);
      });
    }

    const totalGzipSize = stats.total.gzipSize / 1024; // Convert to KB
    if (totalGzipSize > 500) {
      console.log('⚠️  Total bundle size is large (>500KB gzipped)');
      console.log('   - Consider implementing more aggressive code splitting');
      console.log('   - Review and remove unused dependencies');
    }

    if (stats.js.files.some(file => file.name.includes('chunk'))) {
      console.log('✅ Code splitting is active');
    } else {
      console.log('⚠️  No chunks detected - consider implementing code splitting');
    }

    console.log('\n🚀 Performance Tips:');
    console.log('   - Use lazy loading for routes');
    console.log('   - Implement component-level code splitting');
    console.log('   - Consider using a CDN for static assets');
    console.log('   - Enable Brotli compression on your server');
  }
}

// Install gzip-size if not present
const checkDependencies = () => {
  try {
    require('gzip-size');
  } catch (error) {
    console.log('Installing gzip-size...');
    const { execSync } = require('child_process');
    execSync('npm install --save-dev gzip-size', { stdio: 'inherit' });
    console.log('gzip-size installed successfully.\n');
  }
};

// Main execution
if (require.main === module) {
  checkDependencies();
  const analyzer = new BundleAnalyzer();
  analyzer.analyze().catch(console.error);
}

module.exports = BundleAnalyzer;
