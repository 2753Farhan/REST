const express = require('express');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const app = express();

// Function to generate a hash for a file
function getFileHash(filePath) {
    if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        return crypto.createHash('md5').update(fileBuffer).digest('hex').slice(0, 10);
    }
    return Date.now(); // Fallback in case file doesn't exist
}

// Generate hashes for CSS and JS
const jsHash = getFileHash(path.join(__dirname, 'public', 'bundle.js'));
const cssHash = getFileHash(path.join(__dirname, 'public', 'style.css'));

// Middleware to serve static files
app.use('/static', express.static(path.join(__dirname, 'public'), { maxAge: '1y' }));

// Inject cache-busted filenames into HTML
app.get('/', (req, res) => {
    res.send(`
    <html>
        <head>
            <link rel="stylesheet" href="/static/style.${cssHash}.css">
        </head>
        <body>
            <script src="/static/bundle.${jsHash}.js"></script>
            <h1>Hello, Cache Busting!</h1>
        </body>
    </html>
    `);
});

const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
