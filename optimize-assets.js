const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetDirs = [
  path.join(__dirname, 'assets'),
  path.join(__dirname, 'assets', 'images')
];

try {
  // Check if sharp-cli is installed
  console.log('Installing sharp-cli...');
  execSync('npm install --no-save sharp-cli', { stdio: 'inherit' });

  for (const dir of targetDirs) {
    if (!fs.existsSync(dir)) continue;
    
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
        const filePath = path.join(dir, file);
        const tempPath = path.join(dir, 'temp_' + file);
        
        console.log(`Optimizing ${filePath}...`);
        try {
          execSync(`npx sharp -i "${filePath}" -o "${tempPath}" --compressionLevel 9`, { stdio: 'inherit' });
          fs.renameSync(tempPath, filePath);
          console.log(`Successfully optimized ${file}`);
        } catch (e) {
          console.error(`Failed to optimize ${file}:`, e.message);
          if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
          }
        }
      }
    }
  }
} catch (e) {
  console.error('Optimization failed:', e);
}
