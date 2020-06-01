
parser = require('url');
path = require('path');
readFile = require('./utils');

module.exports=class Router {

  constructor (requestHandlers = {}) {
    this.requestHandlers = requestHandlers;
  }

  dispatch(req, res) {
    try {
      const pathname = parser.parse(req.url).pathname;
      if (Object.keys(this.requestHandlers).indexOf(pathname) > -1) {
        this.requestHandlers[pathname](req, res);
      } else {
        readFile(
          path.join(__dirname, "public", pathname),
          (data) => {
            res.setHeader("Content-Type", req.headers.accept.split(",")[0]);
            res.writeHead(200);
            res.end(data);
          }
        )
      } 
    } catch (error) {
      
    }
  }

}