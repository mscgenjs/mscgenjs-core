define(function (require) {
    var mscgenjs = require('../../index');

    function render(){
        window.output.innerHTML = "";
        mscgenjs.renderMsc(
            window.inputscript.value,
            {
                inputType: "msgenny",
                elementId: "output",
                additionalTemplate: "lazy"
            },
            function (pError, pSuccess) {
                if (Boolean(pError)){
                    window.output.innerHTML = pError;
                }
            }
        );
    }

    function setTextAreaToWindowHeight(){
        window.inputscript.style.height = '${height}px'.replace('${height}', window.innerHeight);
    }

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

    setTextAreaToWindowHeight();
    window.version.innerHTML = "mscgenjs ${version}".replace("${version}", mscgenjs.version);
    render();


});
