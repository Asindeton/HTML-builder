const path = require("path");
const stream = require("stream");
const EventEmitter = require("events");
const fs = require("fs");

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const projectDist = path.join(__dirname, "project-dist");

const projectDistHtml = path.join(projectDist, "index.html");
const projectDistCss = path.join(projectDist, "style.css");
const projectDistAssets = path.join(projectDist, "assets");
const projectStyle = path.join(__dirname, "styles");
const projectAssets = path.join(__dirname, "assets");
const projectHtmlComponents = path.join(__dirname, "components");
const projectTemplate = path.join(__dirname, "template.html");

myEmitter.on("event", async () => {
  try {
    const rootFiles = await fs.promises.readdir(__dirname);
    if (!rootFiles.includes("project-dist")) {
      await fs.promises.mkdir(projectDist);
    }
    dellOldItemsFile(projectDistAssets);

    bundleCss();
    bundleAssets();
    bundleHtml();
  } catch (error) {
    console.log(error);
  }
});
myEmitter.emit("event");

const bundleCss = async () => {
  const projStyles = await fs.promises.readdir(projectStyle, {
    withFileTypes: true,
  });
  const bundleFile = await fs.promises.readdir(projectDist);
  if (bundleFile.includes("style.css")) {
    fs.unlink(projectDistCss, function (err) {
      if (err) console.log(err);
    });
  }
  for (const file of projStyles) {
    if (path.extname(file.name) == ".css") {
      const readStream = fs.createReadStream(
        path.join(projectStyle, file.name),
      );
      const writableStream = fs.createWriteStream(projectDistCss, {
        flags: "a",
      });
      readStream.pipe(writableStream);
    }
  }
};

const bundleAssets = async () => {
  const projAssets = await fs.promises.readdir(projectAssets, {
    withFileTypes: true,
  });
  const distAssets = await fs.promises.readdir(projectDist);
  if (!distAssets.includes("assets")) {
    await fs.promises.mkdir(projectDistAssets);
  }
  for (const item of projAssets) {
    copyFolderWithFile(item, projectAssets, projectDistAssets);
  }
};
async function dellOldItemsFile(dir) {
  try {
    const folder = await fs.promises.readdir(dir, {
      withFileTypes: true,
    });
    if (folder.length == 0) {
      fs.rmdir(dir, (err) => (err ? console.log(err) : false));
    }
    folder.forEach(async (e) => {
      if (e.isFile()) {
        fs.unlink(path.join(dir, e.name), (err) =>
          err ? console.log(err) : false,
        );
      } else {
        dellOldItemsFile(path.join(dir, e.name));
      }
    });
  } catch (error) {
    console.log(error);
  }
}
async function copyFolderWithFile(item, from, to) {
  if (item.isDirectory()) {
    const toFolder = await fs.promises.readdir(to);
    const fromFolder = await fs.promises.readdir(path.join(from, item.name), {
      withFileTypes: true,
    });
    if (!toFolder.includes(item.name)) {
      await fs.promises.mkdir(path.join(to, item.name));
    }

    for (const _item of fromFolder) {
      copyFolderWithFile(
        _item,
        path.join(from, item.name),
        path.join(to, item.name),
      );
    }
  } else {
    const readStream = fs.createReadStream(path.join(from, item.name));
    const writableStream = fs.createWriteStream(path.join(to, item.name), {
      flags: "w",
    });
    readStream.pipe(writableStream);
  }
}

const bundleHtml = async () => {
  const toFolder = await fs.promises.readdir(projectHtmlComponents);
  const readStream = fs.createReadStream(projectTemplate);
  readStream.on("data", async (chunk) => {
    htmlString = chunk.toString();
    toFolder.forEach((element) => {
      const elemName = element.split(".")[0];
      const elemReadStream = fs.createReadStream(
        path.join(projectHtmlComponents, element),
      );
      elemReadStream.on("data", (el_chunk) => {
        htmlString = htmlString.replaceAll(
          `{{${elemName}}}`,
          el_chunk.toString(),
        );
        const writableStream = fs.createWriteStream(projectDistHtml, {
          flags: "w",
        });
        writableStream.write(htmlString);
      });
    });
  });
};
