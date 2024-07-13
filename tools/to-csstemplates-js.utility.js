const fs = require("fs");
const path = require("path");

const MULTILINE_COMMENT_RE = /\/\*(.)*?\*\//g;
const SPACES_RE = /( {2}|\n|\r|\t)/gm;
const ADDITION_RE = /\.style$/;

const compress = (pString) =>
  pString.replace(SPACES_RE, "").replace(MULTILINE_COMMENT_RE, "");

const dirNameIsAddition = (pDirName) => Boolean(pDirName.match(ADDITION_RE));

const extractName = (pFileName) =>
  pFileName.substr(3, pFileName.match(ADDITION_RE).index - 3);

const extractFileContents = (pFilePath) =>
  fileExists(pFilePath) ? compress(fs.readFileSync(pFilePath, "utf-8")) : "";

const fileExists = (pFileName) => {
  try {
    fs.readFileSync(pFileName, "utf-8");
    return true;
  } catch (e) {
    return false;
  }
};

const dirNameToAdditionNode = (pRootDirName) => (pDirName) => {
  const $config = require(
    "../" + path.join(pRootDirName, pDirName, "config.json"),
  );

  return {
    name: extractName(pDirName),
    description: $config.description,
    experimental: $config.experimental,
    deprecated: $config.deprecated,
    renderMagic: $config.renderMagic,
    cssBefore: extractFileContents(
      path.join(pRootDirName, pDirName, "before.css"),
    ),
    cssAfter: extractFileContents(
      path.join(pRootDirName, pDirName, "after.css"),
    ),
  };
};

const dirToAdditionsArray = (pRootDirName) =>
  fs
    .readdirSync(pRootDirName)
    .filter(dirNameIsAddition)
    .map((pDirName) =>
      JSON.stringify(
        dirNameToAdditionNode(pRootDirName)(pDirName),
        null,
        "        ",
      ),
    );

process.stdout.write(
  fs
    .readFileSync(
      "src/render/graphics/styling/csstemplates.jsonTemplate",
      "utf-8",
    )
    .replace(
      /<%=additionalTemplates%>/g,
      `[${dirToAdditionsArray("src/render/graphics/styling/")}]`,
    )
    .replace(
      /<%=baseTemplateString%>/g,
      extractFileContents(
        path.join("src/render/graphics/styling/", "base.css"),
      ),
    ),
);
/* the purpose of this utility is to write to a file,
   so non-literal-fs filenames are ok here
*/
