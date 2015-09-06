import http = require('http');
var port = process.env.port || 3000
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World Test');
    console.log('A client connected!');
}).listen(port);



