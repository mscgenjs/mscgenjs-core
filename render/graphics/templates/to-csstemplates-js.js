var fs   = require('fs');
var path = require('path');

const MULTILINE_COMMENT_RE = /\/\*(.)*?\*\//g;
const SPACES_RE            = /( {2}|\n|\r|\t)/gm;
const ADDITION_RE          = /\.addition\.css$/;

let compress = pString =>
    pString.replace(SPACES_RE, "").replace(MULTILINE_COMMENT_RE, "");

let fileNameIsAddition = pFileName =>
    Boolean(pFileName.match(ADDITION_RE));

let extractName = pFileName =>
    pFileName.substr(0, pFileName.match(ADDITION_RE).index);

let extractFileContents = (pDirName, pFileName) =>
    compress(fs.readFileSync(path.join(pDirName, pFileName), 'utf-8'));

let fileNameToAdditionNode = pDirName =>
    pFileName => {
        return {
            name : extractName(pFileName),
            css  : extractFileContents(pDirName, pFileName)
        };
    };

let dirToAdditionsArray = pDirName =>
    fs.readdirSync(pDirName)
    .filter(fileNameIsAddition)
    .map(fileNameToAdditionNode(pDirName));

process.stdout.write(
    fs.readFileSync('render/graphics/templates/csstemplates.template.js', 'utf-8')
    .replace(
        /<%=additionalTemplates%>/g,
        JSON.stringify(
            dirToAdditionsArray("render/graphics/templates/"),
            null,
            "    "
        )
    )
    .replace(
        /<%=baseTemplateString%>/g,
        extractFileContents("render/graphics/templates/", "base.css")
    )
);
