fs = require('fs');

module.exports=readFile = (filepath, callback) => {
  fs.readFile(filepath, (err,data) => {
    if (err) {
      throw new Error('File Not Found!');
    } else {
      callback(data);
    }
  })
}
