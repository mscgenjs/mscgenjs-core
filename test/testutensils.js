var fs     = require('fs');
var crypto = require('crypto');
var chai   = require("chai");

var chaiExpect = chai.expect;
chai.use(require("chai-xml"));

module.exports = (function() {

    var gHashToUse = ['ripemd160', 'md5', 'sha1'].filter(function(h){
        return crypto.getHashes().indexOf(h) > -1;
    })[0];

    function hashit(pString){
        return crypto.createHash(gHashToUse).update(pString).digest('hex');
    }

    function assertequalToFileJSON(pExpectedFileName, pFound) {
        expect(
            pFound
        ).toEqual(
            JSON.parse(
                fs.readFileSync(pExpectedFileName, {"encoding": "utf8"})
            )
        );
    }
    return {
        assertequalToFileJSON : assertequalToFileJSON,

        assertequalFileJSON : function(pFoundFileName, pExpectedFileName){
            assertequalToFileJSON(
                pExpectedFileName,
                JSON.parse(
                    fs.readFileSync(pFoundFileName, {"encoding":"utf8"})
                )
            );
        },

        assertequalToFile: function assertequalToFile(pExpectedFileName, pFoundFileName){
            expect(
                fs.readFileSync(pFoundFileName, {"encoding":"utf8"})
            ).toBe(
                fs.readFileSync(pExpectedFileName, {"encoding":"utf8"})
            );
        },

        assertequalFileXML : function (pFoundFileName, pExpectedFileName){
            var lFound    = fs.readFileSync(pFoundFileName, {"encoding" : "utf8"});
            var lExpected = fs.readFileSync(pExpectedFileName, {"encoding" : "utf8"});

            chaiExpect(lFound).xml.to.be.valid();
            chaiExpect(lFound).xml.to.deep.equal(lExpected);
        },

        assertequalProcessingXML : function(pExpectedFileName, pInputFileName, pProcessingFn){
            var lProcessedInput   = pProcessingFn(
                fs.readFileSync(pInputFileName, {"encoding" : "utf8"})
            );

            chaiExpect(lProcessedInput).xml.to.be.valid();
            chaiExpect(
                lProcessedInput
            ).xml.to.deep.equal(
                fs.readFileSync(pExpectedFileName, {"encoding" : "utf8"})
            );
        },

        assertequalProcessing : function(pExpectedFileName, pInputFileName, pProcessingFn){
            expect(
                hashit(
                    fs.readFileSync(pExpectedFileName, {"encoding" : "utf8"})
                )
            ).toBe(
                hashit(
                    pProcessingFn(
                        fs.readFileSync(pInputFileName, {"encoding" : "utf8"})
                    )
                )
            );
        },

        assertSyntaxError: function(pProgram, pParser, pErrorType){
            if (!pErrorType){
                pErrorType = "SyntaxError";
            }
            try {
                var lStillRan = false;
                if (pParser.parse(pProgram)) {
                    lStillRan = true;
                }
                expect(lStillRan).toBe(false);
            } catch (e) {
                expect(e.name).toBe(pErrorType);
            }
        }
    };

})();
