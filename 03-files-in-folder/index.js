const path = require("path");
const stream = require("stream");
const EventEmitter = require("events");
const fs = require("fs");

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const filePath = path.join(__dirname, "secret-folder");

myEmitter.on("event", async () => {
  try {
    const files = await fs.promises.readdir(filePath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        fs.stat(
          path.join(__dirname, "secret-folder", file.name),
          (err, stats) => {
            console.log(
              path.basename(file.name, path.extname(file.name)),
              "-",
              path.extname(file.name).split(".")[1],
              "-",
              (stats.size / 1024).toFixed(3) + " kb",
            );
          },
        );
      } else {
      }
    }
  } catch (err) {
    console.error(err);
  }
});
myEmitter.emit("event");
