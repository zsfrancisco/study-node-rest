import http from 'http';
import * as fs from "fs";

const server = http.createServer((req, res) => {
    console.log(req.url);
    if (req.url === '/') {
        const htmlFile = fs.readFileSync('./public/index.html', 'utf-8');
        res.writeHead(200, {'Content-type': 'text/html'});
        res.end(htmlFile);
        return;
    }

    if (req.url?.endsWith('.js')) {
        res.writeHead(200, {'Content-type': 'application/javascript'});
    } else if (req.url?.endsWith('.css')) {
        res.writeHead(200, {'Content-type': 'text/css'});
    }

    const responseContent = fs.readFileSync(`./public${req.url}`, 'utf-8');
    res.end(responseContent);
});

server.listen(3000, () => {
    console.log('Server is running');
});