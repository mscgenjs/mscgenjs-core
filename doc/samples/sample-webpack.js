// var mscgenjs = require('../../dist/mscgen').mscgen;
var mscgenjs = require('../../dist/mscgen');

function render(){
    // clear the target area before rendering on it
    window.output.innerHTML = "";

    // render whatever is in window.inputscript at the moment
    mscgenjs.renderMsc(
        window.inputscript.value,
        {
            inputType: "msgenny", // make this "mscgen" or "xu" to make it an interpreter in that language
            elementId: "output", // id of the element to render in
            additionalTemplate: "lazy" // use the 'lazy' style addtions specially made for msgenny
        },
        function (pError, pSuccess) {
            if (Boolean(pError)){
                window.output.innerHTML = pError;
            }
        }
    );
}
/**
 * Make sure the textarea remains floor to ceiling
 */
function setTextAreaToWindowHeight(){
    window.inputscript.style.height = '${height}px'.replace('${height}', window.innerHeight);
}

/* set up some listeners */
window.render.addEventListener("click", render, false);
window.loop.addEventListener(
    "click",
    function(){
        window.inputscript.value += "\nAlice loop Bob: condition {\n  Alice =>> Bob: do stuff;\n};\n";
        render();
    },
    false
);
window.alt.addEventListener(
    "click",
    function(){
        window.inputscript.value += "\nAlice alt Bob: happyflow {\n  # happy flow here\n\n  ---: alternateflow;  \n  # alternate flow here\n};\n";
        render();
    },
    false
);
window.addEventListener("resize", setTextAreaToWindowHeight);

/* main*/
setTextAreaToWindowHeight();
window.version.innerHTML = "mscgenjs ${version}".replace("${version}", mscgenjs.version);
render();
