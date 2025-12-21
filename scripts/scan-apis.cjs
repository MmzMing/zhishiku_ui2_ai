
const fs = require('fs');
const path = require('path');

const apiDir = path.resolve(__dirname, '../src/api');
const outputFile = path.resolve(__dirname, '../src/config/api-list.json');

function scanDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      scanDir(filePath, fileList);
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const apiFiles = scanDir(apiDir);
const apis = [];

apiFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const relativePath = path.relative(path.resolve(__dirname, '../src'), file).replace(/\\/g, '/');
  
  // 匹配 export const funcName = ...
  // 并尝试捕获多行注释中的描述
  const funcRegex = /\/\*\*\s*\n\s*\*\s*([^\n]+)[\s\S]*?export\s+const\s+(\w+)\s*=\s*(?:async)?\s*\([^)]*\)\s*(?::\s*[^{]+)?\s*=>\s*\{\s*return\s+(get|post|put|delete|patch)\s*\(\s*['"]([^'"]+)['"]/gm;
  
  let match;
  while ((match = funcRegex.exec(content)) !== null) {
    apis.push({
      key: `${relativePath}-${match[2]}`,
      file: relativePath,
      description: match[1].trim(),
      name: match[2],
      method: match[3].toUpperCase(),
      path: match[4]
    });
  }
});

// 确保目录存在
const configDir = path.dirname(outputFile);
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

fs.writeFileSync(outputFile, JSON.stringify(apis, null, 2));
console.log(`Successfully scanned ${apis.length} APIs and saved to ${outputFile}`);
