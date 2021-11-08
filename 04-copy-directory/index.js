const path = require("path");
const EventEmitter = require("events");
const fs = require("fs");

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const writePathFolder = path.join(__dirname, "files-copy");
const readPathFolder = path.join(__dirname, "files");

myEmitter.on("event", async () => {
  try {
    const files1 = await fs.promises.readdir(__dirname);
    if (!files1.includes("files-copy")) {
      await fs.promises.mkdir(writePathFolder);
    }

    const files2 = await fs.promises.readdir(writePathFolder);
    for (const files of files2) {
      fs.unlink(path.join(writePathFolder, files), function (err) {
        if (err) console.log(err);
      });
    }

    const files = await fs.promises.readdir(readPathFolder, {
      withFileTypes: true,
    });

    for (const file of files) {
      const readStream = fs.createReadStream(
        path.join(readPathFolder, file.name),
      );
      const writableStream = fs.createWriteStream(
        path.join(writePathFolder, file.name),
        { flags: "w" },
      );
      readStream.pipe(writableStream);
    }
  } catch (error) {
    console.error(error);
  }
});
myEmitter.emit("event");
