define(function (require) {
    var mscgenjs = require('../../src/index');

    function render(){
        window.output.innerHTML = "";
        mscgenjs.renderMsc(
            window.inputscript.value,
            {
                inputType: "xu",
                elementId: "output",
                additionalTemplate: "lazy",
                mirrorEntitiesOnBottom: false,
                includeSource: false
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
            window.inputscript.value += "\na loop d: condition {\n  a =>> d: do stuff;\n};\n";
            render();
        },
        false
    );
    window.alt.addEventListener(
        "click",
        function(){
            window.inputscript.value += "\na alt d: happyflow {\n  # happy flow here\n\n  ---: alternateflow;  \n  # alternate flow here\n};\n";
            render();
        },
        false
    );
    window.addEventListener("resize", setTextAreaToWindowHeight);

    setTextAreaToWindowHeight();
    window.version.innerHTML = "mscgenjs ${version}".replace("${version}", mscgenjs.version);
    render();


});
