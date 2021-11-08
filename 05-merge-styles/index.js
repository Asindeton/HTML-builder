const path = require("path");
const stream = require("stream");
const EventEmitter = require("events");
const fs = require("fs");

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const writePathBundle = path.join(__dirname, "project-dist", "bundle.css");
const readPathFolder = path.join(__dirname, "styles");

myEmitter.on("event", async () => {
  try {
    const styleFiles = await fs.promises.readdir(readPathFolder, {
      withFileTypes: true,
    });

    const bundleFile = await fs.promises.readdir(
      path.join(__dirname, "project-dist"),
    );
    if (bundleFile.includes("bundle.css")) {
      fs.unlink(writePathBundle, function (err) {
        if (err) console.log(err);
      });
    }
    for (const file of styleFiles) {
      if (path.extname(file.name) == ".css") {
        const readStream = fs.createReadStream(
          path.join(readPathFolder, file.name),
        );
        const writableStream = fs.createWriteStream(writePathBundle, {
          flags: "a",
        });
        readStream.pipe(writableStream);
      }
    }
  } catch (error) {
    console.log(error);
  }
});
myEmitter.emit("event");
