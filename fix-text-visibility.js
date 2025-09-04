const fs = require('fs');
const path = require('path');

// Find all TypeScript/JSX files
function getAllTsxFiles(dir) {
  const files = [];
  
  function traverse(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and build directories
        if (!['node_modules', 'build', '.git'].includes(item)) {
          traverse(fullPath);
        }
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Color replacements and fixes
const fixes = [
  // Fix hardcoded white text colors
  {
    pattern: /color:\s*['"`]?white['"`]?/g,
    replacement: "color: ${({ theme }) => theme.colors.card}",
    description: "Replace hardcoded white with theme card color"
  },
  {
    pattern: /color:\s*['"`]?#fff['"`]?/g,
    replacement: "color: ${({ theme }) => theme.colors.card}",
    description: "Replace hardcoded #fff with theme card color"
  },
  {
    pattern: /color:\s*['"`]?#ffffff['"`]?/g,
    replacement: "color: ${({ theme }) => theme.colors.card}",
    description: "Replace hardcoded #ffffff with theme card color"
  },
  // Fix white text in hover states on primary backgrounds
  {
    pattern: /(\s*&:hover\s*{[^}]*background[^}]*primary[^}]*)color:\s*white/g,
    replacement: "$1color: white",
    description: "Keep white text on primary background hovers"
  },
  // Fix gray text colors to use theme colors
  {
    pattern: /color:\s*['"`]?#[0-9a-fA-F]{6}['"`]?/g,
    replacement: (match) => {
      // Map common gray colors to theme colors
      const colorMap = {
        '#6B7280': "${({ theme }) => theme.colors.textLight}",
        '#9CA3AF': "${({ theme }) => theme.colors.gray400}",
        '#374151': "${({ theme }) => theme.colors.gray600}",
        '#1F2937': "${({ theme }) => theme.colors.text}",
        '#F9FAFB': "${({ theme }) => theme.colors.text}",
        '#E5E7EB': "${({ theme }) => theme.colors.textLight}",
        '#D1D5DB': "${({ theme }) => theme.colors.textLight}"
      };
      
      for (const [hardcoded, themed] of Object.entries(colorMap)) {
        if (match.includes(hardcoded)) {
          return `color: ${themed}`;
        }
      }
      return match; // Return original if no mapping found
    },
    description: "Replace hardcoded grays with theme colors"
  }
];

// Apply fixes to a file
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    for (const fix of fixes) {
      const originalContent = content;
      
      if (typeof fix.replacement === 'function') {
        content = content.replace(fix.pattern, fix.replacement);
      } else {
        content = content.replace(fix.pattern, fix.replacement);
      }
      
      if (content !== originalContent) {
        changed = true;
        console.log(`✓ Fixed ${fix.description} in ${path.basename(filePath)}`);
      }
    }
    
    // Special handling for specific problematic patterns
    
    // Fix FeatureDescription that uses gray600 which might be too light in dark mode
    if (content.includes('FeatureDescription') && content.includes('gray600')) {
      content = content.replace(/color:\s*\$\{\(\{\s*theme\s*\}\)\s*=>\s*theme\.colors\.gray600\}/g, 
        'color: ${({ theme }) => theme.colors.textLight}');
      changed = true;
      console.log(`✓ Fixed FeatureDescription color in ${path.basename(filePath)}`);
    }
    
    // Fix DataStructureDescription that uses gray600
    if (content.includes('DataStructureDescription') && content.includes('gray600')) {
      content = content.replace(/color:\s*\$\{\(\{\s*theme\s*\}\)\s*=>\s*theme\.colors\.gray600\}/g, 
        'color: ${({ theme }) => theme.colors.textLight}');
      changed = true;
      console.log(`✓ Fixed DataStructureDescription color in ${path.basename(filePath)}`);
    }
    
    // Fix any remaining gray600 references in styled components
    if (content.includes('theme.colors.gray600')) {
      content = content.replace(/theme\.colors\.gray600/g, 'theme.colors.textLight');
      changed = true;
      console.log(`✓ Replaced remaining gray600 references in ${path.basename(filePath)}`);
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

// Main execution
function main() {
  const srcDir = path.join(__dirname, 'src');
  const files = getAllTsxFiles(srcDir);
  
  console.log(`Found ${files.length} TypeScript files to process...`);
  
  let processedCount = 0;
  for (const file of files) {
    if (fixFile(file)) {
      processedCount++;
    }
  }
  
  console.log(`\n✅ Processing complete!`);
  console.log(`📊 Files processed: ${processedCount} out of ${files.length}`);
}

main();
