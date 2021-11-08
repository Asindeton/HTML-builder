const path = require("path");
const process = require("process");
const { stdin: input, stdout: output } = require("process");
const EventEmitter = require("events");
const readline = require("readline");
const fs = require("fs");

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const filePath = path.join(__dirname, "/text.txt");

const writableStream = fs.createWriteStream(filePath, { flags: "a" });

myEmitter.on("event", () => {
  console.log(
    "Привет, введи текст который будет записаны в файл 02-write-file/text.txt",
  );
  const rl = readline.createInterface({ input, output });
  rl.on("line", (answer) => {
    if (answer.toLowerCase().trim() == "exit") {
      exitFormApp();
    }
    writableStream.write(answer);
  });

  rl.on("SIGINT", exitFormApp);

  writableStream.on("error", (err) => console.log(err));
});
myEmitter.emit("event");

function exitFormApp() {
  console.log("\nСпасибо");
  writableStream.end("\r\n");
  process.exit();
}
