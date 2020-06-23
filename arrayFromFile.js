
fs = require('fs');

(() => {
  let content = "export const lastnames = [\n";
  fs.readFile('./names', 'utf8', (err, data) => {
    let adjectives = data.split("\n");
    console.log(typeof adjectives);
    console.log(adjectives.length);
    console.log(adjectives[3]);
    for (let adjective in adjectives) {
      content += "\t\""+adjectives[adjective]+"\",\n";
    }
    content += "]\n";
    console.log(content);
    fs.open('./lastnames.js', 'w', (err, fd) => {
      fs.write(fd, content, () => {});
    });
  });
})()
