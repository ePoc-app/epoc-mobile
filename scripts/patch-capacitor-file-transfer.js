const fs = require('fs');
const path = require('path');

// Path to the target file
const filePath = path.join(
    __dirname,
    '..',
    'node_modules',
    '@capacitor',
    'file-transfer',
    'dist',
    'web-PpQmeXfA.js'
);

// Read the file
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('[POST INSTALL] Error reading file:', err);
        return;
    }

    // Split the file into lines
    const lines = data.split('\n');

    // Comment out lines 249-255 (indices 248-254) if not already commented
    for (let i = 248; i <= 254; i++) {
        if (lines[i] && !lines[i].trim().startsWith('//')) {
            lines[i] = `// ${lines[i]}`;
        }
    }

    // Join the lines back into a single string
    const modifiedData = lines.join('\n');

    // Write the modified data back to the file
    fs.writeFile(filePath, modifiedData, 'utf8', (err) => {
        if (err) {
            console.error('[POST INSTALL] Error writing file:', err);
            return;
        }
        console.log('[POST INSTALL] File patched successfully!');
    });
});