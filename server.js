const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

// MIME türleri
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // CORS headers ekle
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // JSON dosyası kaydetme (POST isteği)
    if (req.method === 'POST' && pathname.endsWith('.json')) {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const filePath = path.join(__dirname, pathname.substring(1));
                fs.writeFileSync(filePath, body);
                console.log(`✅ JSON kaydedildi: ${pathname}`);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Dosya kaydedildi' }));
            } catch (error) {
                console.error(`❌ JSON kaydetme hatası: ${error.message}`);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
        return;
    }
    
    // Dosya okuma (GET isteği)
    let filePath = path.join(__dirname, pathname === '/' ? '/test_engine.html' : pathname);
    
    // Dosya var mı kontrol et
    if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Dosya bulunamadı: ' + pathname);
        return;
    }
    
    // Dosya uzantısını al
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    try {
        const content = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
        console.log(`📁 Dosya okundu: ${pathname}`);
    } catch (error) {
        console.error(`❌ Dosya okuma hatası: ${error.message}`);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Dosya okuma hatası');
    }
});

server.listen(PORT, () => {
    console.log(`🚀 Server başlatıldı: http://localhost:${PORT}`);
    console.log('💾 JSON dosyaları gerçek dosya sistemine kaydedilecek');
    console.log('🌐 Tarayıcıdan http://localhost:8000 adresini ziyaret edin');
});
