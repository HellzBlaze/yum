const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // This just serves your HTML file. All logic is now in the HTML itself.
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
        if (err) { res.writeHead(404); res.end("Not Found"); return; }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});

server.listen(3000, '0.0.0.0', () => {
    console.log("🚀 YUM PRO Standalone running on port 3000");
});
