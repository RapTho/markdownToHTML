const yargs = require("yargs");
const showdown = require("showdown");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

const argv = yargs(process.argv.slice(2)).argv;
const converter = new showdown.Converter();
const error = chalk.bold.red;
const success = chalk.bold.green;

const isValidPath = (mdPath, htmlPath) => {
  let pathStats = {};

  try {
    pathStats = fs.statSync(mdPath);
    if (typeof htmlPath !== "string") throw Error();
  } catch (err) {
    console.log(
      error(
        "No markdown file found or invalid --html path. Please provide valid paths for --md and --html"
      )
    );
    return false;
  }

  return pathStats.isFile();
};

const convertMDtoHTML = (markdownPath, htmlPath) => {
  // Check that --md has a valid path and that --html is a string
  if (!isValidPath(markdownPath, htmlPath)) return;

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
      `Success! The converted HTML file was saved to ${path.resolve(htmlPath)}`
    )
  );
};

// The default command to catch all other than convert
yargs.command({
  command: "*",
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
});

yargs.command({
  command: "convert",
  describe: "--md PATH_TO_MARKDOWN_FILE --html PATH_TO_HTML_FILE",
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
  handler: convertMDtoHTML(argv.md, argv.html),
});

yargs.parse();
