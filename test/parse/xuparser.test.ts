import { describe, it } from "node:test";
import { deepEqual } from "node:assert/strict";
import Ajv from "ajv";
import * as fs from "fs";
import * as path from "path";
import * as parser from "../../src/parse/xuparser";
// import * as mscgenjsASTSchema from "../../src/parse/mscgenjs-ast.schema.json";
const mscgenjsASTSchema = require("../../src/parse/mscgenjs-ast.schema.json");
import * as tst from "../testutensils";
import * as pairs from "./mscgenPairs.js";
import * as xuPairs from "./xuPairs.js";

const ajv = new Ajv();

describe("parse/xuparser", () => {
  describe("#parse()", () => {
    it("should correctly parse naked reals", () => {
      const lAST = parser.parse("xu{HSCAle=481.1337;a;}") as any;
      deepEqual(lAST.options.hscale, "481.1337");
    });
    it("should correctly parse quoted cardinals", () => {
      const lAST = parser.parse('xu{width="481";a;}') as any;
      deepEqual(lAST.options.width, "481");
    });
    it("should correctly parse quoted reals", () => {
      const lAST = parser.parse('xu{width="481.1337";a;}') as any;
      deepEqual(lAST.options.width, "481.1337");
    });
    it("should correctly parse naked cardinals", () => {
      const lAST = parser.parse("xu{width=481;a;}") as any;
      deepEqual(lAST.options.width, "481");
    });
  });
  describe("#parse() - happy day ASTs - ", () => {
    pairs.programASTPairs.forEach((pPair) => {
      it(pPair.title, () => {
        deepEqual(parser.parse(pPair.program), pPair.ast);
      });
    });
  });

  describe("#parse() - syntax errors - ", () => {
    pairs.syntaxErrors.forEach((pPair) => {
      it(pPair.title, () => {
        tst.assertSyntaxError(pPair.program, parser, pPair.error);
      });
    });
  });

  describe("#parse() - inline expressions - ", () => {
    it("should throw a SyntaxError on _that's not an inline expression_ arc type", () => {
      tst.assertSyntaxError("msc{a, b; a => b{|||;};}", parser);
    });
  });

  describe("#parse() - file based tests", () => {
    it("should parse all possible arcs", () => {
      const lTextFromFile = fs.readFileSync(
        path.join(__dirname, "../fixtures/test01_all_possible_arcs.xu"),
        { encoding: "utf8" },
      );
      const lAST = parser.parse(lTextFromFile.toString());
      ajv.validate(mscgenjsASTSchema, lAST);
      tst.assertequalToFileJSON(
        path.join(__dirname, "../fixtures/test01_all_possible_arcs.json"),
        lAST,
      );
    });
    it("should parse stuff with colors", () => {
      const lTextFromFile = fs.readFileSync(
        path.join(__dirname, "../fixtures/rainbow.mscin"),
        { encoding: "utf8" },
      );
      const lAST = parser.parse(lTextFromFile.toString());
      ajv.validate(mscgenjsASTSchema, lAST);
      tst.assertequalToFileJSON(
        path.join(__dirname, "../fixtures/rainbow.json"),
        lAST,
      );
    });
    it("strings, ids and urls", () => {
      const lTextFromFile = fs.readFileSync(
        path.join(__dirname, "../fixtures/test10_stringsandurls.mscin"),
        { encoding: "utf8" },
      );
      const lAST = parser.parse(lTextFromFile.toString());
      ajv.validate(mscgenjsASTSchema, lAST);
      tst.assertequalToFileJSON(
        path.join(__dirname, "../fixtures/test10_stringsandurls.json"),
        lAST,
      );
    });
  });

  describe("#parse() - xu specific extensions", () => {
    describe("#parse() - happy day ASTs - ", () => {
      xuPairs.programASTPairs.forEach((pPair) => {
        it(pPair.title, () => {
          const lAST = parser.parse(pPair.program);
          ajv.validate(mscgenjsASTSchema, lAST);
          deepEqual(lAST, pPair.ast);
        });
      });
    });

    describe("#parse() - syntax errors - ", () => {
      xuPairs.syntaxErrors.forEach((pPair) => {
        it(pPair.title, () => {
          tst.assertSyntaxError(pPair.program, parser, pPair.error);
        });
      });
    });
    it("should accept watermark as an option", () => {
      const lAST = parser.parse(
        'xu{arcgradient= 20, watermark="Goûter le filigraine" ; a,b,c,d,e,f; c =>> * [label="Hello everyone"];}',
      ) as any;
      deepEqual(lAST.options.watermark, "Goûter le filigraine");
    });
    it("should accept AUTO as a valid width", () => {
      const lAST = parser.parse(
        'xu{ arcgradient=20, width=AUTO; a,b,c,d,e,f; c =>> * [label="Hello everyone"];}',
      ) as any;
      deepEqual(lAST.options.width, "auto");
    });
    it('should accept "AUTO" as a valid width', () => {
      const lAST = parser.parse(
        'xu{ arcgradient=20, width="AUTO"; a,b,c,d,e,f; c =>> * [label="Hello everyone"];}',
      ) as any;
      deepEqual(lAST.options.width, "auto");
    });
  });
});
