#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing framer-motion imports...');

// Files that use styled(motion.div) or motion components
const filesToFix = [
  'src/pages/dataStructures/GraphPage.tsx',
  'src/pages/dataStructures/ArrayPage.tsx',
  'src/pages/dataStructures/StackPage.tsx',
  'src/pages/dataStructures/HashTablePage.tsx',
  'src/pages/dataStructures/HeapPage.tsx',
  'src/pages/algorithms/sorting/ShellSortPage.tsx',
  'src/pages/dataStructures/LinkedListPage.tsx',
  'src/pages/algorithms/SearchingPage.tsx',
  'src/pages/dataStructures/TriePage.tsx',
  'src/pages/algorithms/sorting/BucketSortPage.tsx',
  'src/pages/algorithms/sorting/RadixSortPage.tsx',
  'src/pages/dataStructures/PriorityQueuePage.tsx',
  'src/pages/dataStructures/QueuePage.tsx',
  'src/pages/dataStructures/TreePage.tsx'
];

filesToFix.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Check if the file contains motion usage but doesn't have motion import
    const hasMotionUsage = /styled\(motion\.|motion\./g.test(content);
    const hasMotionImport = /import.*motion.*from.*framer-motion/g.test(content);
    
    if (hasMotionUsage && !hasMotionImport) {
      console.log(`✅ Adding motion import to: ${filePath}`);
      
      // Find the last import statement and add motion import after it
      const importRegex = /import[^;]+from[^;]+;/g;
      let lastImportMatch;
      let match;
      
      while ((match = importRegex.exec(content)) !== null) {
        lastImportMatch = match;
      }
      
      if (lastImportMatch) {
        const insertPosition = lastImportMatch.index + lastImportMatch[0].length;
        const beforeInsert = content.substring(0, insertPosition);
        const afterInsert = content.substring(insertPosition);
        
        content = beforeInsert + '\nimport { motion } from \'framer-motion\';' + afterInsert;
        
        fs.writeFileSync(fullPath, content);
        console.log(`   📝 Fixed: ${filePath}`);
      }
    } else if (!hasMotionUsage) {
      console.log(`⚠️  No motion usage found in: ${filePath}`);
    } else {
      console.log(`✅ Already has motion import: ${filePath}`);
    }
  } else {
    console.log(`❌ File not found: ${filePath}`);
  }
});

console.log('🎉 Motion imports fixed!');
