import { describe, it } from "node:test";
import { deepEqual } from "node:assert/strict";
import Ajv from "ajv";
import * as fs from "fs";
import * as path from "path";
import * as parser from "../../src/parse/mscgenparser";
import * as tst from "../testutensils";

const mscgenjsASTSchema = require("../../src/parse/mscgenjs-ast.schema.json");
const pairs = require("./mscgenPairs");

const ajv = new Ajv();


describe("parse/mscgenparser", () => {
  describe("#parse() - happy day values", () => {
    it("should correctly parse naked reals", () => {
      const lAST = parser.parse("msc{HSCAle=481.1337;a;}") as any;
      deepEqual(lAST.options.hscale, "481.1337");
    });
    it("should correctly parse quoted cardinals", () => {
      const lAST = parser.parse('msc{width="481";a;}') as any;
      deepEqual(lAST.options.width, "481");
    });
    it("should correctly parse quoted reals", () => {
      const lAST = parser.parse('msc{width="481.1337";a;}') as any;
      deepEqual(lAST.options.width, "481.1337");
    });
    it("should correctly parse naked cardinals", () => {
      const lAST = parser.parse("msc{width=481;a;}") as any;
      deepEqual(lAST.options.width, "481");
    });
  });

  describe("#parse() - happy day ASTs - ", () => {
    pairs.programASTPairs.forEach((pPair) => {
      it(pPair.title, () => {
        const lAST = parser.parse(pPair.program);
        ajv.validate(mscgenjsASTSchema, lAST);
        deepEqual(lAST, pPair.ast);
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

  describe("#parse() - file based tests - ", () => {
    it("should parse all possible arcs", () => {
      const lTextFromFile = fs.readFileSync(
        path.join(
          __dirname,
          "../fixtures/test01_all_possible_arcs_mscgen.mscin"
        ),
        { encoding: "utf8" }
      );
      const lAST = parser.parse(lTextFromFile.toString());
      ajv.validate(mscgenjsASTSchema, lAST);
      tst.assertequalToFileJSON(
        path.join(
          __dirname,
          "../fixtures/test01_all_possible_arcs_mscgen.json"
        ),
        lAST
      );
    });
    it("should parse stuff with colors", () => {
      const lTextFromFile = fs.readFileSync(
        path.join(__dirname, "../fixtures/rainbow.mscin"),
        {
          encoding: "utf8",
        }
      );
      const lAST = parser.parse(lTextFromFile.toString());
      ajv.validate(mscgenjsASTSchema, lAST);
      tst.assertequalToFileJSON(
        path.join(__dirname, "../fixtures/rainbow.json"),
        lAST
      );
    });
    it("strings, ids and urls", () => {
      const lTextFromFile = fs.readFileSync(
        path.join(__dirname, "../fixtures/test10_stringsandurls.mscin"),
        { encoding: "utf8" }
      );
      const lAST = parser.parse(lTextFromFile.toString());
      ajv.validate(mscgenjsASTSchema, lAST);
      tst.assertequalToFileJSON(
        path.join(__dirname, "../fixtures/test10_stringsandurls.json"),
        lAST
      );
    });
  });
});
