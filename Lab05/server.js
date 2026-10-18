const http = require('http');
const fs=require('fs');
const path=require('path');
const { stringify } = require('querystring');

const PORT=3000;
const DATA_FILE=path.join(__dirname, 'data', 'estudiantes.json')

const MIME_TYPES={
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json'
};

const server=http.createServer((req,res) => {
    if(req.url==='/api/estudiantes' && req.method==='GET') {
        fs.readFile(DATA_FILE, 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(500, {'Content-Type':'application/json'});
                return res.end(JSON.stringify({message:'Error internoa al leer los datos'}));
            }
            res.writeHead(200, {'Content-Type':'application/json'});
            res.end(data);
        });
        return;
    }
    if(req.url==='/api/estudiantes' && req.method==='POST') {
        let body= '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const nuevoEstudiante=JSON.parse(body);

                fs.readFile(DATA_FILE, 'utf-8', (err,data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ message: 'Error interno del servidor' }));
                    }
                    const estudiantes=JSON.parse(data);
                    nuevoEstudiante.id=estudiantes.length>0 ? Math.max(...estudiantes.map(e=>e.id))+1
                    :1;
                    estudiantes.push(nuevoEstudiante);
                    fs.writeFile(DATA_FILE, JSON.stringify(estudiantes, null, 2), err => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            return res.end(JSON.stringify({ message: 'Error al guardar en disco' }));
                        }
                        res.writeHead(201, {'Content-Type':'application/json'});
                        res.end(JSON.stringify(nuevoEstudiante));
                    });
                });
            } catch (error) {
                res.writeHead(400, {'Content-Type':'application/json'});
                res.end(JSON.stringify({ message: 'Formato JSON no válido'}))
            }   
        });
        return;
    }
    let relativePath=req.url==='/' ? 'index.html':req.url;
    const filePath=path.join(__dirname, 'public', relativePath);
    const ext=path.extname(filePath).toLowerCase();
    const contentType=MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if(err) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({message: 'Recurso no encontrado'}));
        } else {
            res.writeHead(200, {'Content-Type': contentType});
            res.end(content);
        }
    });
})
server.listen(PORT, ()=> {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});