const path = require("path");
const stream = require("stream");
const EventEmitter = require("events");
const fs = require("fs");

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const readStream = fs.createReadStream(path.join(__dirname, "/text.txt"));

myEmitter.on("event", () => {
  readStream.on("data", (data) => {
    console.log(data.toString());
  });
});
myEmitter.emit("event");
