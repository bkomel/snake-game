fs = require('fs');
http = require('http');
parser = require('url');
path = require('path');

Router = require('./router');

const port = 3001;

const requestHandlers = {
  '/': (req, res) => {
    readFile(
      path.join(__dirname, "public", "index.html"),
      (data) => {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(data);
      }
    )
  }
}

const server = http.createServer((req, res) => {
  const router = new Router(requestHandlers);
  router.dispatch(req, res);
});

server.listen(port, () => {
  console.log(`Server running at http://172.17.0.3:${port}/`);
});
