const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    console.log(`Received ${method} request for ${url}`);

    if (url === '/' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end('Welcome to the Home Page');
    }

    if (url === '/contact' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <form method="POST" action="/contact">
            <input type="text" name="name" placeholder="Your name" />
            <button type="submit">Submit</button>
          </form>
        `);
        return;
    }

    if (url === '/contact' && method === 'POST') {
        let body = '';
    
        req.on('data', chunk => {
          body += chunk.toString();
        });
    
        req.on('end', () => {
            const parsedBody = new URLSearchParams(body);
            const name = parsedBody.get('name');
            
            if (!name || name.trim() === '') {
                res.writeHead(400, { 'Content-Type': 'text/html' });
                return res.end('<h1>Error: Name field cannot be empty</h1>');
            }

            const submission = { name: name.trim() };

            fs.appendFile('submissions.json', JSON.stringify(submission) + '\n', err => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.end('<h1>Error saving data.</h1>');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(`
                        <h1>Thank You!</h1>
                        <p>Your name (${name}) has been saved successfully.</p>
                    `);
                }
            });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('404 Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});
