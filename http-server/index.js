/* eslint-disable no-undef */
const http = require("http");
const fs = require("fs");
const path = require("path");
const minimist = require("minimist");

let homeContent = "";
let projectContent = "";
let registrationContent = "";

fs.readFile("home.html", (err, home) => {
  if (err) throw err;
  homeContent = home;
});

fs.readFile("project.html", (err, project) => {
  if (err) throw err;
  projectContent = project;
});

fs.readFile("registration.html", (err, registration) => {
  if (err) throw err;
  registrationContent = registration;
});

const args = minimist(process.argv.slice(2));
const port = parseInt(args.port);

http
  .createServer((req, res) => {
    let url = req.url;
    if (url.endsWith(".js")) {
      const file_path = path.join(__dirname, url);
      fs.readFile(file_path, (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.write("404 Not Found");
          res.end();
          return;
        }
        res.writeHead(200, { "Content-Type": "application/javascript" });
        res.write(data);
        res.end();
      });
      return;
    }

    res.writeHeader(200, { "Content-Type": "text/html" });
    switch (url) {
      case "/project":
        res.write(projectContent);
        res.end();
        break;
      case "/registration":
        res.write(registrationContent);
        res.end();
        break;
      default:
        res.write(homeContent);
        res.end();
        break;
    }
  })
  .listen(port);
