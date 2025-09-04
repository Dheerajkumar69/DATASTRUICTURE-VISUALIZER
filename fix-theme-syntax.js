const fs = require('fs');
const path = require('path');

// Files with syntax errors that need fixing
const problematicFiles = [
  'D:\\projects\\DATASTRUICTURE-VISUALIZER\\src\\pages\\algorithms\\graph\\DFSPage.tsx',
  'D:\\projects\\DATASTRUICTURE-VISUALIZER\\src\\pages\\algorithms\\graph\\UndirectedCycleDetectionPage.tsx',
  'D:\\projects\\DATASTRUICTURE-VISUALIZER\\src\\pages\\algorithms\\graph\\BFSPageNew.tsx',
  'D:\\projects\\DATASTRUICTURE-VISUALIZER\\src\\pages\\algorithms\\graph\\DirectedCycleDetectionPage.tsx',
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    // Fix theme color references that are incorrectly placed inside JavaScript objects
    // This pattern matches theme color references that are incorrectly inserted as JavaScript expressions
    const themeColorPattern = /color: \$\{\(\{ theme \}\) => theme\.colors\.[a-zA-Z]+\},/g;
    
    if (content.match(themeColorPattern)) {
      // Replace with appropriate default colors for canvas/node contexts
      content = content.replace(themeColorPattern, 'color: "#fff",');
      changed = true;
      console.log(`✓ Fixed theme color syntax in ${path.basename(filePath)}`);
    }
    
    // Fix any array literals that contain invalid theme expressions
    const arrayThemePattern = /{ color: \$\{\(\{ theme \}\) => theme\.colors\.[a-zA-Z]+\}, label:/g;
    if (content.match(arrayThemePattern)) {
      content = content.replace(arrayThemePattern, '{ color: "#E2E8F0", label:');
      changed = true;
      console.log(`✓ Fixed array theme color syntax in ${path.basename(filePath)}`);
    }
    
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
  
  return false;
}

// Process the problematic files
let fixedCount = 0;
for (const file of problematicFiles) {
  if (fs.existsSync(file)) {
    if (fixFile(file)) {
      fixedCount++;
    }
  } else {
    console.log(`File not found: ${file}`);
  }
}

console.log(`\n✅ Fixed ${fixedCount} files with theme syntax errors.`);
