const express = require("express");
const app = express();
const server = require("http").Server(app);
var morgan = require("morgan");
app.use(morgan("common"));

const fs = require("fs");
const { promisify } = require("util");
// const axios = require("axios");
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
// const fsExtra = require("fs-extra");

const try_async =
  (func, error) =>
  async (...args) => {
    try {
      await func(...args);
    } catch {
      console.log("error");
      if (error) console.log(error);
    }
  };

app.get(
  "/",
  try_async(async (req, res) => {
    var files_name = await readdir("Database");

    var files = files_name.map(async (name) => {
      var file = await readFile(`Database\\${name}`);
      return { name, file };
    });
    files = await Promise.all(files);

    var buf = Buffer.from(JSON.stringify(files));

    res.write(buf, "binary");
    res.end(null, "binary");
  })
);

server.listen(4000);

console.log("rodando");
