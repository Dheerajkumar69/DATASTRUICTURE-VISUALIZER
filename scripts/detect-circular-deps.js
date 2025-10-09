#!/usr/bin/env node

/**
 * Circular Dependency Detection Script
 * Analyzes the codebase for potential circular import dependencies
 */

const fs = require('fs');
const path = require('path');

class CircularDependencyDetector {
  constructor() {
    this.dependencies = new Map();
    this.visited = new Set();
    this.recursionStack = new Set();
    this.cycles = [];
  }

  // Extract imports from a file
  extractImports(filePath, content) {
    const imports = [];
    const importRegex = /import\s+(?:{[^}]*}|\*\s+as\s+\w+|\w+)\s+from\s+['"](.*?)['"];?/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      
      // Skip node_modules imports
      if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
        continue;
      }

      // Resolve relative path
      const resolvedPath = this.resolvePath(filePath, importPath);
      if (resolvedPath) {
        imports.push(resolvedPath);
      }
    }

    return imports;
  }

  // Resolve relative import path
  resolvePath(currentFile, importPath) {
    const currentDir = path.dirname(currentFile);
    let resolvedPath;

    if (importPath.startsWith('./') || importPath.startsWith('../')) {
      resolvedPath = path.resolve(currentDir, importPath);
    } else {
      return null;
    }

    // Try common extensions
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx'];
    
    for (const ext of extensions) {
      const fullPath = resolvedPath + ext;
      if (fs.existsSync(fullPath)) {
        return fullPath;
      }
    }

    return null;
  }

  // Scan directory for TypeScript/JavaScript files
  scanDirectory(dir) {
    const files = [];
    
    const scanRecursive = (currentDir) => {
      const items = fs.readdirSync(currentDir, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item.name);
        
        if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
          scanRecursive(fullPath);
        } else if (item.isFile() && /\.(ts|tsx|js|jsx)$/.test(item.name)) {
          files.push(fullPath);
        }
      }
    };

    scanRecursive(dir);
    return files;
  }

  // Build dependency graph
  buildDependencyGraph(srcDir) {
    console.log('🔍 Scanning files for dependencies...');
    const files = this.scanDirectory(srcDir);
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const imports = this.extractImports(file, content);
        this.dependencies.set(file, imports);
      } catch (error) {
        console.warn(`⚠️  Could not read file: ${file}`);
      }
    }
    
    console.log(`📊 Analyzed ${files.length} files`);
  }

  // Detect cycles using DFS
  detectCycles(node, path = []) {
    if (this.recursionStack.has(node)) {
      // Found a cycle
      const cycleStart = path.indexOf(node);
      const cycle = path.slice(cycleStart);
      cycle.push(node);
      this.cycles.push(cycle);
      return true;
    }

    if (this.visited.has(node)) {
      return false;
    }

    this.visited.add(node);
    this.recursionStack.add(node);
    path.push(node);

    const dependencies = this.dependencies.get(node) || [];
    for (const dep of dependencies) {
      if (this.detectCycles(dep, [...path])) {
        // Cycle detected
      }
    }

    this.recursionStack.delete(node);
    return false;
  }

  // Run analysis
  analyze(srcDir = './src') {
    console.log('🔄 Starting circular dependency analysis...');
    
    this.buildDependencyGraph(srcDir);
    
    console.log('🕵️  Detecting circular dependencies...');
    
    // Check each file for cycles
    for (const file of this.dependencies.keys()) {
      this.visited.clear();
      this.recursionStack.clear();
      this.detectCycles(file);
    }

    this.reportResults();
  }

  // Report results
  reportResults() {
    console.log('\n📋 Circular Dependency Analysis Results');
    console.log('='.repeat(50));

    if (this.cycles.length === 0) {
      console.log('✅ No circular dependencies detected!');
      return;
    }

    console.log(`❌ Found ${this.cycles.length} circular dependencies:`);
    
    this.cycles.forEach((cycle, index) => {
      console.log(`\n🔄 Cycle #${index + 1}:`);
      cycle.forEach((file, i) => {
        const shortPath = path.relative(process.cwd(), file);
        console.log(`  ${i + 1}. ${shortPath}`);
      });
    });

    console.log('\n💡 Recommendations to fix circular dependencies:');
    console.log('1. Extract shared interfaces/types to a separate file');
    console.log('2. Use dependency injection instead of direct imports');
    console.log('3. Create a barrel export (index.ts) to centralize exports');
    console.log('4. Move shared utilities to a common directory');
    console.log('5. Consider restructuring component hierarchy');
  }
}

// Run the analysis
if (require.main === module) {
  const detector = new CircularDependencyDetector();
  const srcDir = process.argv[2] || './src';
  detector.analyze(srcDir);
}

module.exports = CircularDependencyDetector;