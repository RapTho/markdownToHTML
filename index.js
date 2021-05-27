const yargs = require("yargs");
const showdown = require("showdown");
var chalk = require("chalk");
const fs = require("fs");
const path = require("path");

const argv = yargs(process.argv.slice(2)).argv;
const converter = new showdown.Converter();
const error = chalk.bold.red;
const success = chalk.bold.green;

const isValidPath = (path) => {
  let pathStats = {};
  try {
    pathStats = fs.statSync(path);
  } catch (err) {
    console.log(
      error("No markdown file found. Please provide a valid path for --md!")
    );
    return false;
  }
  return pathStats.isFile();
};

const convertMDtoHTML = () => {
  let markdownPath = argv.md;
  let htmlPath = argv.html;

  // Check that --md has a valid path
  if (!isValidPath(markdownPath)) return;

  try {
    let md = fs.readFileSync(markdownPath).toString();
    let html = converter.makeHtml(md);
    fs.writeFileSync(htmlPath, html);
  } catch (err) {
    console.log(error(err.message));
    return;
  }
  console.log(
    success(
      `Your HTML file was converted and saved to ${path.resolve(htmlPath)}`
    )
  );
};

yargs.command({
  command: "convert",
  describe:
    "This command converts markdown files to html files.\nCommand structure: node index.js convert --md <PATH-TO-MARKDOWN-FILE> --html <PATH-TO-HTML-FILE>",
  builder: {
    md: {
      describe: "Path to the markdown file e.g. ./README.md",
      demandOption: true,
      type: "string",
    },
    html: {
      describe: "Path to the output html file e.g. ./README.html",
      demandOption: true,
      type: "string",
    },
  },
  handler: convertMDtoHTML(),
});
