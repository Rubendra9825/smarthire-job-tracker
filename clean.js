const fs = require('fs');
const path = require('path');

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file.startsWith('.')) continue;
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.css') || fullPath.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // 1. Remove block comments with many equals signs
      content = content.replace(/\/\*\s*=+[^+]*?=+\s*\*\//g, '');
      
      // 2. Remove line comments with --
      content = content.replace(/\/\/ *--+[^\r\n]*[\r\n]+/g, '');
      
      // 3. Remove lines with "Stage X" in comments
      content = content.replace(/\/\/.*?[Ss]tage \d+.*[\r\n]+/g, '');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}
processDir('./frontend');
processDir('./backend');
console.log('Cleanup script executed.');
