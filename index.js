const http = require('http');
const fs = require('fs');
const path = require('path');

// --- THE MASTER DATABASE ---
let db = {
    menuItems: [
        { id: 1, name: 'Burger', price: 150, cost: 60 }, 
        { id: 2, name: 'Fries', price: 80, cost: 25 }
    ],
    globalToppings: [{ id: 1, name: 'Extra Cheese', price: 20 }],
    employees: [],
    orders: [],
    orderCounter: 100,
    adminPin: '1234',
    managerPin: '5678'
};

const server = http.createServer((req, res) => {
    // Enable CORS so other tablets on your Wi-Fi can talk to this one
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

    // API: GET DATA
    if (req.method === 'GET' && req.url === '/api/data') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(db));
    } 

    // API: UPDATE DATA
    else if ((req.method === 'POST' || req.method === 'PATCH') && req.url === '/api/data') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const incomingData = JSON.parse(body);
                db = { ...db, ...incomingData }; 
                res.writeHead(200); res.end('OK');
            } catch (e) {
                res.writeHead(400); res.end('Invalid JSON');
            }
        });
    } 

    // SERVE THE HTML FILE
    else if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) { res.writeHead(404); res.end("File Not Found"); return; }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else {
        res.writeHead(404); res.end('Not Found');
    }
});

// KSWEB/Local Port (8080 is standard for local testing)
const PORT = 8080; 
server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n---------------------------------`);
    console.log(`🚀 YUM PRO IS LIVE LOCALLY`);
    console.log(`Open on this tablet: http://localhost:${PORT}`);
    console.log(`---------------------------------\n`);
});
