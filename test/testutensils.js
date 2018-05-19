const fs     = require('fs');
const crypto = require('crypto');
const chai   = require("chai");

const chaiExpect = chai.expect;
chai.use(require("chai-xml"));

module.exports = (function() {

    const gHashToUse = ['ripemd160', 'md5', 'sha1'].filter((h) => crypto.getHashes().indexOf(h) > -1)[0];

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
        assertequalToFileJSON,

        assertequalFileJSON(pFoundFileName, pExpectedFileName){
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

        assertequalFileXML (pFoundFileName, pExpectedFileName){
            const lFound    = fs.readFileSync(pFoundFileName, {"encoding" : "utf8"});
            const lExpected = fs.readFileSync(pExpectedFileName, {"encoding" : "utf8"});

            chaiExpect(lFound).xml.to.be.valid();
            chaiExpect(lFound).xml.to.deep.equal(lExpected);
        },

        assertequalProcessingXML(pExpectedFileName, pInputFileName, pProcessingFn){
            const lProcessedInput   = pProcessingFn(
                fs.readFileSync(pInputFileName, {"encoding" : "utf8"})
            );

            chaiExpect(lProcessedInput).xml.to.be.valid();
            chaiExpect(
                lProcessedInput
            ).xml.to.deep.equal(
                fs.readFileSync(pExpectedFileName, {"encoding" : "utf8"})
            );
        },

        assertequalProcessing(pExpectedFileName, pInputFileName, pProcessingFn){
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

        assertSyntaxError(pProgram, pParser, pErrorType){
            if (!pErrorType){
                pErrorType = "SyntaxError";
            }
            try {
                let lStillRan = false;
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
