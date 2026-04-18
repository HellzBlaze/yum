const http = require('http');
const fs = require('fs');

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
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Allow PATCH method for partial data merging
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
    
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

    if (req.method === 'GET' && req.url === '/api/data') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(db));
    } 
    else if ((req.method === 'POST' || req.method === 'PATCH') && req.url === '/api/data') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const incomingData = JSON.parse(body);
                // MERGE the new data into the database safely
                db = { ...db, ...incomingData };
                res.writeHead(200); res.end('OK');
            } catch (e) {
                res.writeHead(400); res.end('Invalid JSON');
            }
        });
    } 
    else if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
        fs.readFile('./index.html', (err, data) => {
            if (err) { res.writeHead(404); res.end('index.html not found'); return; }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else {
        res.writeHead(404); res.end('Not Found');
    }
});

const PORT = 8080;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🍔 Yum Server is running!`);
    console.log(`1. On this computer, go to: http://localhost:${PORT}`);
    console.log(`2. On other LAN devices, go to: http://<YOUR_COMPUTER_IP_ADDRESS>:${PORT}\n`);
});
