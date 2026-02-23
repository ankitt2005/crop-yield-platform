const fs = require('fs');
const path = require('path');

const DIRS_TO_SCAN = ['src', 'server', 'ml-service'];
const FILES_TO_SCAN = ['Patent_Technical_Disclosure_Draft.md', 'README.md'];
const EXTENSIONS = ['.js', '.jsx', '.py', '.md', '.json', '.html'];

function processText(text) {
    // Safe general replacements
    let processed = text;

    // Specific variable overrides
    processed = processed.replace(/currentYield/g, 'currentCrop');
    processed = processed.replace(/optimizedYield/g, 'optimizedCrop');
    processed = processed.replace(/baseYield/g, 'baseCrop');
    processed = processed.replace(/fused_base_yield/g, 'fused_base_crop');
    processed = processed.replace(/base_yield/g, 'base_crop');
    processed = processed.replace(/YieldPredictionCard/g, 'CropPredictionCard');
    processed = processed.replace(/YieldPrediction/g, 'CropPrediction');
    processed = processed.replace(/yieldPrediction/g, 'cropPrediction');
    processed = processed.replace(/Yield Prediction/g, 'Crop Prediction');
    processed = processed.replace(/yield prediction/g, 'crop prediction');
    processed = processed.replace(/Crop Yield/g, 'Crop Prediction');
    processed = processed.replace(/crop yield/g, 'crop prediction');

    // Generic case-sensitive word replacements
    processed = processed.replace(/\byield\b/g, 'crop');
    processed = processed.replace(/\bYield\b/g, 'Crop');
    processed = processed.replace(/\bYIELD\b/g, 'CROP');

    return processed;
}

function processDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '__pycache__' && !file.startsWith('.')) {
                processDirectory(fullPath);
            }
        } else {
            const ext = path.extname(fullPath);
            if (EXTENSIONS.includes(ext)) {
                processFile(fullPath);
            }
        }
    }
}

function processFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const orgContent = content;
        content = processText(content);

        if (content !== orgContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${filePath}`);
        }

        // Rename file if it has "Yield" in the basename
        const dir = path.dirname(filePath);
        const base = path.basename(filePath);
        if (base.includes('Yield')) {
            const newBase = base.replace(/Yield/g, 'Crop');
            const newPath = path.join(dir, newBase);
            fs.renameSync(filePath, newPath);
            console.log(`Renamed: ${filePath} -> ${newPath}`);
        }
    } catch (err) {
        console.error(`Error processing ${filePath}: ${err.message}`);
    }
}

try {
    DIRS_TO_SCAN.forEach(dir => {
        if (fs.existsSync(dir)) processDirectory(dir);
    });

    FILES_TO_SCAN.forEach(file => {
        if (fs.existsSync(file)) processFile(file);
    });
    console.log('Refactoring complete.');
} catch (err) {
    console.error("Global Error:", err);
}
