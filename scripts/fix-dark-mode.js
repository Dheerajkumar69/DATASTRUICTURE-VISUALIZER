const fs = require('fs');
const path = require('path');

// Common replacements for dark mode fixes
const replacements = [
  // Hard-coded white backgrounds
  {
    search: /background:\s*white;/g,
    replace: 'background: ${({ theme }) => theme.colors.card};'
  },
  {
    search: /background-color:\s*white;/g,
    replace: 'background-color: ${({ theme }) => theme.colors.card};'
  },
  
  // Hard-coded colors
  {
    search: /color:\s*#333;/g,
    replace: 'color: ${({ theme }) => theme.colors.text};'
  },
  {
    search: /color:\s*#666;/g,
    replace: 'color: ${({ theme }) => theme.colors.textLight};'
  },
  {
    search: /color:\s*#999;/g,
    replace: 'color: ${({ theme }) => theme.colors.gray500};'
  },
  
  // Hard-coded backgrounds
  {
    search: /background:\s*#f8f9fa;/g,
    replace: 'background: ${({ theme }) => theme.colors.gray100};'
  },
  {
    search: /background-color:\s*#f8f9fa;/g,
    replace: 'background-color: ${({ theme }) => theme.colors.gray100};'
  },
  {
    search: /background:\s*#e9ecef;/g,
    replace: 'background: ${({ theme }) => theme.colors.gray200};'
  },
  {
    search: /background-color:\s*#e9ecef;/g,
    replace: 'background-color: ${({ theme }) => theme.colors.gray200};'
  },
  
  // Common button colors
  {
    search: /background:\s*#007bff;/g,
    replace: 'background: ${({ theme }) => theme.colors.primary};'
  },
  {
    search: /background-color:\s*#007bff;/g,
    replace: 'background-color: ${({ theme }) => theme.colors.primary};'
  },
  {
    search: /background:\s*#0056b3;/g,
    replace: 'background: ${({ theme }) => theme.colors.primaryDark};'
  },
  {
    search: /background-color:\s*#0056b3;/g,
    replace: 'background-color: ${({ theme }) => theme.colors.primaryDark};'
  },
  
  // Add borders where needed
  {
    search: /border-radius: \${[^}]+};\s*$/gm,
    replace: '$&\n  border: 1px solid ${({ theme }) => theme.colors.border};'
  }
];

// Function to process a file
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Apply all replacements
    replacements.forEach(({ search, replace }) => {
      if (search.test(content)) {
        content = content.replace(search, replace);
        modified = true;
      }
    });
    
    // Add theme-aware transitions where missing
    if (content.includes('styled.') && content.includes('background') && !content.includes('transition:')) {
      content = content.replace(
        /(background[^;]*;)/g, 
        '$1\n  transition: all 0.3s ease;'
      );
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Function to recursively find React component files
function findReactFiles(dir) {
  const files = [];
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip node_modules and build directories
        if (!['node_modules', 'build', '.git'].includes(entry.name)) {
          files.push(...findReactFiles(fullPath));
        }
      } else if (entry.isFile()) {
        // Process TypeScript/JavaScript React files
        if (/\.(tsx?|jsx?)$/.test(entry.name) && 
            !entry.name.includes('.test.') && 
            !entry.name.includes('.spec.')) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  
  return files;
}

// Main execution
function main() {
  console.log('🌙 Starting dark mode fix...\n');
  
  const srcDir = path.join(__dirname, '..', 'src');
  const reactFiles = findReactFiles(srcDir);
  
  console.log(`Found ${reactFiles.length} React files to process...\n`);
  
  let processedCount = 0;
  
  reactFiles.forEach(file => {
    processFile(file);
    processedCount++;
  });
  
  console.log(`\n🎉 Dark mode fix complete! Processed ${processedCount} files.`);
  console.log('\n📝 Remember to:');
  console.log('1. Test the application in both light and dark modes');
  console.log('2. Check for any remaining hard-coded colors');
  console.log('3. Verify all theme transitions work smoothly');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { processFile, findReactFiles, main };
