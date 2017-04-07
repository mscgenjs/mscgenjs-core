var fs   = require('fs');
var path = require('path');

const MULTILINE_COMMENT_RE = /\/\*(.)*?\*\//g;
const SPACES_RE            = /( {2}|\n|\r|\t)/gm;
const ADDITION_RE          = /\.style$/;

let compress = pString =>
    pString.replace(SPACES_RE, "").replace(MULTILINE_COMMENT_RE, "");

let dirNameIsAddition = pDirName =>
    Boolean(pDirName.match(ADDITION_RE));

let extractName = pFileName =>
    pFileName.substr(3, pFileName.match(ADDITION_RE).index - 3);

let extractFileContents = pFilePath =>
    fileExists(pFilePath) ? compress(fs.readFileSync(pFilePath, 'utf-8')) : "";

let fileExists = pFileName => {
    try {
        fs.readFileSync(pFileName, 'utf-8');
        return true;
    } catch (e) {
        return false;
    }
};

let dirNameToAdditionNode = pRootDirName =>
    pDirName => {
        let $config = require("./" + path.join(pDirName, "config.json"));

        return {
            name         : extractName(pDirName),
            description  : $config.description,
            experimental : $config.experimental,
            deprecated   : $config.deprecated,
            renderMagic  : $config.renderMagic,
            cssBefore    : extractFileContents(path.join(pRootDirName, pDirName, "before.css")),
            cssAfter     : extractFileContents(path.join(pRootDirName, pDirName, "after.css"))
        };
    };

let dirToAdditionsArray = pRootDirName =>
    fs.readdirSync(pRootDirName)
        .filter(dirNameIsAddition)
        .map(dirNameToAdditionNode(pRootDirName));

process.stdout.write(
    fs.readFileSync('render/graphics/styling/csstemplates.template.js', 'utf-8')
        .replace(
            /<%=additionalTemplates%>/g,
            JSON.stringify(
                dirToAdditionsArray("render/graphics/styling/"),
                null,
                "    "
            )
        )
        .replace(
            /<%=baseTemplateString%>/g,
            extractFileContents(path.join("render/graphics/styling/", "base.css"))
        )
);
