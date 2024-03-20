const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '../dist');
const commitHashFilePath = path.join(distPath, 'commit-hash.txt');

try {
    const commitHash = execSync('git rev-parse HEAD').toString().trim();

    if(!fs.existsSync(distPath)) {
        console.error('Dist directory does not exist. Run the build process first.');
        process.exit(1);
    }

    fs.writeFileSync(commitHashFilePath, commitHash, { encoding: 'utf-8' });

    console.log('Commit hash file created successfully.');
} catch (error) {
    console.error('Failed to write the commit hash file', error);
}