const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

const server = http.createServer(function(req, res) {
    const parsedUrl = url.parse(req.url, true);

    if (req.method === 'POST' && parsedUrl.pathname === '/process') {
        let body = '';
        req.on('data', function(chunk) {
            body += chunk.toString(); 
          });
        req.on('end', function() {
            const names = body.split('\n').filter(name => name.trim() !== '');
 
            const processedNames = names.map(name => 
                name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
            ).sort();

            fs.writeFileSync(path.join(__dirname, '../resource/original_names.txt'), names.join('\n'));
            fs.writeFileSync(path.join(__dirname, '../resource/processed_names.txt'), processedNames.join('\n'));
            
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Names processed successfully');
        });
    } else {
        let filePath;
        if (parsedUrl.pathname === '/') {
            filePath = path.join(__dirname, '../html/index.html');
        } else if (parsedUrl.pathname === '/results.html') {
            filePath = path.join(__dirname, '../html/results.html');
        } else if (parsedUrl.pathname === '/css/styles.css') {
            filePath = path.join(__dirname, '../css/styles.css');
        } else if (parsedUrl.pathname === '/js/client.js') {
            filePath = path.join(__dirname, 'client.js');
        } else if (parsedUrl.pathname === '/resource/original_names.txt') {
            filePath = path.join(__dirname, '../resource/original_names.txt');
        } else if (parsedUrl.pathname === '/resource/processed_names.txt') {
            filePath = path.join(__dirname, '../resource/processed_names.txt');
        } else {
            res.writeHead(404);
            return res.end('Not Found');
        }
    
        let contentType = 'text/html';
        if (filePath.endsWith('.css')) contentType = 'text/css';
        if (filePath.endsWith('.js')) contentType = 'text/javascript';
        if (filePath.endsWith('.txt')) contentType = 'text/plain';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(200, {'Content-Type': contentType});
                res.end(content);
            }
        });
    }
});

server.listen(PORT, function() {
    console.log('Сервер запущен на порту ' + PORT);
  });