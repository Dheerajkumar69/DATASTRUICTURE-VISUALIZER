const fs = require('fs-extra');
const path = require('path');

// Move files from duplicate directory to root
async function fixDirectoryStructure() {
  const srcDir = path.join(__dirname, '..', 'DATASTRUICTURE-VISUALIZER');
  const destDir = path.join(__dirname, '..');

  try {
    // Check if duplicate directory exists
    if (fs.existsSync(srcDir)) {
      // Copy all contents from duplicate directory
      await fs.copy(srcDir, destDir, {
        overwrite: false,
        errorOnExist: true
      });

      // Remove duplicate directory
      await fs.remove(srcDir);
      
      console.log('Successfully fixed directory structure');
    }
  } catch (err) {
    console.error('Error fixing directory structure:', err);
  }
}

fixDirectoryStructure();
