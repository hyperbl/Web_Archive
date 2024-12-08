// server.js -- server-side JavaScript
// This file is the entry point for the server-side code.
// It is responsible for setting up the server and handling requests.
import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';

// default configuration
const config = {
    "host": "localhost",
    "port": 3000,
    "root": "./",
    "indexPage": "./html/index.html"
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
        const readStream = fs.createReadStream(pathName);
        readStream.on('error', (err) => {
            console.error('Error reading file:', err);
            this.respondNotFound(req, res);
        });
        readStream.pipe(res);
    }
    routeHandler(pathName, req, res) {
        fs.stat(pathName, (err, stats) => {
            if (err) {
                console.error('Error stat-ing file:', err);
                this.respondNotFound(req, res);
            } else if (stats.isDirectory()) {
                this.routeHandler(path.join(pathName, this.indexPage), req, res);
            } else {
                this.respondFile(pathName, req, res);
            }
        });
    }
    start() {
        http.createServer((req, res) => {
            const pathName = path.join(this.root, path.normalize(req.url));
            console.log(`Request for ${pathName}`);
            res.statusCode = 200;
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
