const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const names = ['дарья', 'мария', 'татьяна', 'владимир', 'никита', 'настя', 'артем', 'алина'];

function sendFile(res, filePath, contentType) {
  fs.readFile(path.join(__dirname, '..', filePath), function(err, data) {
    if (err) {
      res.statusCode = 404;
      res.end('Не найдено');
    } else {
      res.setHeader('Content-Type', contentType);
      res.end(data);
    }
  });
}

const server = http.createServer(function(req, res) {
  if (req.url === '/') {
    sendFile(res, 'html/index.html', 'text/html');
  } 
  else if (req.url === '/result') {
    sendFile(res, 'html/result.html', 'text/html');
  }
  else if (req.url === '/api/names') {
    res.end(JSON.stringify(names));
  }
  else if (req.url === '/api/process') {
    const processed = names.map(function(n) {
      return n[0].toUpperCase() + n.slice(1);
    }).sort();
    res.end(JSON.stringify(processed));
  }
  else if (req.url.endsWith('.css') || req.url.endsWith('.js')) {
    const type = req.url.endsWith('.css') ? 'text/css' : 'text/javascript';
    sendFile(res, req.url, type);
  }
});

server.listen(PORT, function() {
  console.log('Сервер запущен на порту ' + PORT);
});