// server.js -- server-side JavaScript
// This file is the entry point for the server-side code.
// It is responsible for setting up the server and handling requests.
import http from 'node:http';
import path from 'node:path';
import url from 'node:url';
import fs from 'node:fs';
import formidable from 'formidable';

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
    // 处理 404
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
    // 处理文件请求
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
    /**
     * 处理路由
     * @param {string} pathName 
     * @param {http.IncomingMessage} req 
     * @param {http.ServerResponse<http.IncomingMessage> &
     *  {req: http.IncomingMessage;}} res 
     */
    routeHandler(pathName, req, res) {
        if (req.method === 'POST' && req.url === '/upload') {
            console.log('Uploading file...');
            const uploadDir = path.join(this.root, 'uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir);
            }
            const form = formidable({
                uploadDir: uploadDir,
                keepExtensions: true
            });
            form.parse(req, (err, fields, files) => {
                if (err) {
                    console.error('Error parsing form:', err);
                    res.writeHead(500, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({success: false, message: 'Error parsing form'}));
                    return;
                } else {
                    console.log('File uploaded:', files);
                    const uploadFiles = Array.isArray(files.file)
                    ? files.file.map((file) => ({
                        originalFilename: file.originalFilename,
                        newFilename: file.newFilename,
                        size: file.size,
                        filepath: file.filepath
                    }))
                    : [{
                        originalFilename: files.file.originalFilename,
                        newFilename: files.file.newFilename,
                        size: files.file.size,
                        filepath: files.file.filepath
                    }] 
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({success: true, files: uploadFiles}));
                    return;
                }
            });
        } else if (req.method === 'GET' && req.url.includes('/download')) {
            const parsedUrl = url.parse(req.url, true);
            const fileUrl = parsedUrl.query.fileUrl;
            console.log('Downloading file:', fileUrl);
            const readStream = fs.createReadStream(fileUrl);
            readStream.on('error', (err) => {
                console.error('Error reading file:', err);
                this.respondNotFound(req, res);
            });
            res.setHeader('Content-Disposition', `attachment; filename=${path.basename(fileUrl)}`);
            readStream.pipe(res);
        } else if (req.method === 'DELETE' && req.url === '/delete') {
            console.log('Deleting file...');
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', () => {
                const parsedData = JSON.parse(data);
                const fileUrl = parsedData.fileUrl;
                console.log('Deleting file:', fileUrl);
                fs.unlink(fileUrl, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                        res.writeHead(500, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({success: false, message: 'Error deleting file'}));
                    } else {
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({success: true, message: 'File deleted successfully'}));
                    }
                });
            });
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
    // 启动服务器
    start() {
        http.createServer((req, res) => {
            const parsedUrl = url.parse(req.url);
            const pathName = path.join(this.root, path.normalize(parsedUrl.pathname));
            console.log(`Request for ${pathName}`);
            // res.statusCode = 200;
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
