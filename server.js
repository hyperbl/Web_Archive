// server.js -- server-side JavaScript
// This file is the entry point for the server-side code.
// It is responsible for setting up the server and handling requests.
import http from 'node:http';
import path from 'node:path';
import url from 'node:url';
import fs from 'node:fs';

// default configuration
const config = {
    "host": "localhost",
    "port": 3001,
    "root": "./",
    "indexPage": "./html/index.html"
};

// MIME types
const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".ico": "image/x-icon",
    ".svg": "image/svg+xml",
    ".pdf": "application/pdf",
    ".zip": "application/zip",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".txt"  : "text/plain",
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".eot": "application/vnd.ms-fontobject"
};

class Server {
    constructor() {
        this.host = config.host;
        this.port = config.port;
        this.root = config.root;
        this.indexPage = config.indexPage;
    }
    respondNotFound(req, res) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        const readStream = fs.createReadStream(this.root + 'html/404.html');
        readStream.on('error', (err) => {
            console.error('Error reading 404 file:', err);
            res.end('Not Found');
        });
        readStream.pipe(res);
        // res.end('Not Found');
    }
    respondFile(pathName, req, res) {
        const ext = path.extname(pathName);
        const mimeType = mimeTypes[ext] || 'application/octet-stream';
        res.writeHead(200, {'Content-Type': mimeType});
        const readStream = fs.createReadStream(pathName);
        readStream.on('error', (err) => {
            console.error('Error reading file:', err);
            this.respondNotFound(req, res);
        });
        readStream.pipe(res);
    }
    routeHandler(pathName, req, res) {
        if (req.method === 'POST' && req.url === '/upload') {
            console.log('Uploading file...');
        } else {
            fs.stat(pathName, (err, stats) => {
                if (err) {
                    console.error('Error stat-ing file:', err);
                    this.respondNotFound(req, res);
                } else if (stats.isDirectory()) {
                    this.routeHandler(path.join(pathName, this.indexPage), req, res);
                } else if (stats.isFile()) {
                    this.respondFile(pathName, req, res);
                } else {
                    this.respondNotFound(req, res);
                }
            });
        }
    }
    start() {
        http.createServer((req, res) => {
            const parsedUrl = url.parse(req.url);
            const pathName = path.join(this.root, path.normalize(parsedUrl.pathname));
            console.log(`Request for ${pathName}`);
            // res.statusCode = 200;
            // res.writeHead(200);
            // res.end(`Request for ${pathName}`);
            this.routeHandler(pathName, req, res);
        }).listen(this.port, this.host, (err) => {
            if (err) {
                console.error('Error starting server:', err);
                console.info('Exiting...');
            } else {
                console.log(`Server running at http://${this.host}:${this.port}/`);
            }
        })
    }
}

const server = new Server();
server.start();
