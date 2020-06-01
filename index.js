fs = require('fs');
http = require('http');
parser = require('url');
path = require('path');

const port = 3001;

const readFile = (filepath, callback) => {
  fs.readFile(filepath, (err,data) => {
    if (err) {
      throw new Error('File Not Found!');
    } else {
      callback(data);
    }
  });
}

const routes = {
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


const router = (req, res) => {
  try {
    const pathname = parser.parse(req.url).pathname;
    if (Object.keys(routes).indexOf(pathname) > -1) {
      routes[pathname](req, res);
    } else {
      readFile(
        path.join(__dirname, "public", pathname),
        (data) => {
          res.setHeader("Content-Type", "text/" + path.extname(pathname).replace(/^\./, ""));
          res.writeHead(200);
          res.end(data);
        }
      )
    }
  } catch (error) {
    res.setHeader('Content-Type', 'text/plain');
    res.writeHead(404);
    res.write("404 Not Found");
    res.end();
  }
}

const server = http.createServer((req, res) => {
  const url = parser.parse(req.url)
  router(req, res);
});

server.listen(port, () => {
  console.log(`Server running at http://172.17.0.3:${port}/`);
});
