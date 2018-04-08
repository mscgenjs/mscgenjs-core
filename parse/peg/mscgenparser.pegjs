/*
 * parser for MSC (messsage sequence chart)
 * see http://www.mcternan.me.uk/mscgen/ for more
 * information
 *
 * In some pathetic border cases this grammar behaves differently
 * from the original mscgen lexer/ parser:
 * - In the original mscgen booleans and ints are
 *   allowed in some of the options, without presenting them
 *   as quotes, but floats are not. This PEG
 *   does allow them ...
 * - quoted identifiers present some problems in mscgen in this
 *   pathological case:
 *   define entitites "C" and C
 *   - the entities are rendered as separate ones
 *   - C -> "C",  generates a self-reference
 *     to C, as does "C" -> C and "C" -> "C"
 *   mscgen_js does not render the entities as separate ones
 * - in mscgen grammar, only the option list is optional;
 *   empty input (no entities/ no arcs) is not allowed
 *   mscgen_js does allow this.
 */

{
    function getMetaInfo(){
        return {
            "extendedOptions" : false,
            "extendedArcTypes": false,
            "extendedFeatures": false
        }
    }
}

program
    = pre:_ starttoken _  "{" _ declarations:declarationlist _ "}" _
    {
        declarations.entities = declarations.entities || [];
        parserHelpers.checkForUndeclaredEntities(declarations.entities, declarations.arcs);

        declarations = _.assign ({meta: getMetaInfo()}, declarations);

        if (pre.length > 0) {
            declarations = _.assign({precomment: pre}, declarations);
        }
        return declarations;
    }

starttoken
    = "msc"i

declarationlist
    = options:optionlist?
      entities:entitylist?
      arcs:arclist?
      {
          var lDeclarationList = {};
          if (options) {
              lDeclarationList.options = options;
          }
          if (entities) {
              lDeclarationList.entities = entities;
          }
          if (arcs) {
              lDeclarationList.arcs = arcs;
          }
          return lDeclarationList;
      }

optionlist
    = options:((o:option "," {return o})*
               (o:option ";" {return o}))
    {
        return parserHelpers.optionArray2Object(options[0].concat(options[1]));
    }

option "option"
    = _ name:("hscale"i/ "width"i/ "arcgradient"i) _ "=" _ value:numberlike _
        {
            return parserHelpers.nameValue2Option(name, value);
        }
    / _ name:"wordwraparcs"i _ "=" _ value:booleanlike _
        {
            return parserHelpers.nameValue2Option(name, parserHelpers.flattenBoolean(value));
        }

entitylist
    = el:((e:entity "," {return e})* (e:entity ";" {return e}))
    {
      return el[0].concat(el[1]);
    }

entity "entity"
    =  _ name:string _ attrList:("[" a:attributelist  "]" {return a})? _
        {
            return _.assign ({name:name}, attrList);
        }
    /  _ name:quotelessidentifier _ attrList:("[" a:attributelist  "]" {return a})? _
        {
          if (parserHelpers.isMscGenKeyword(name)){
            error("Keywords aren't allowed as entity names (embed them in quotes if you need them)");
          }
          return _.assign ({name:name}, attrList);
        }


arclist
    = (a:arcline _ ";" {return a})+

arcline
    = al:((a:arc _ "," {return a})* (a:arc {return a}))
    {
       return al[0].concat(al[1]);
    }

arc
    = a:((a:singlearc {return a})
    / (a:dualarc {return a})
    / (a:commentarc {return a}))
    al:("[" al:attributelist "]" {return al})?
    {
      return _.assign (a, al);
    }

singlearc
    = _ kind:singlearctoken _ {return {kind:kind}}

commentarc
    = _ kind:commenttoken _ {return {kind:kind}}

dualarc
    = (_ from:identifier _ kind:dualarctoken _ to:identifier _
      {return {kind: kind, from:from, to:to}})
    /(_ "*" _ kind:bckarrowtoken _ to:identifier _
      {return {kind:kind, from: "*", to:to}})
    /(_ from:identifier _ kind:fwdarrowtoken _ "*" _
      {return {kind:kind, from: from, to:"*"}})
     /(_ from:identifier _ kind:bidiarrowtoken _ "*" _
      {return {kind:kind, from: from, to:"*"}})

singlearctoken "empty row"
    = "|||"
    / "..."

commenttoken "---"
    = "---"

dualarctoken
    = kind:(bidiarrowtoken
    / fwdarrowtoken
    / bckarrowtoken
    / boxtoken)
    {return kind.toLowerCase()}

bidiarrowtoken "bi-directional arrow"
    = "--"  / "<->"
    / "=="  / "<<=>>"
            / "<=>"
    / ".."  / "<<>>"
    / "::"  / "<:>"

fwdarrowtoken "left to right arrow"
    = "->"
    / "=>>"
    / "=>"
    / ">>"
    / ":>"
    / "-x"i

bckarrowtoken "right to left arrow"
    = "<-"
    / "<<="
    / "<="
    / "<<"
    / "<:"
    / "x-"i

boxtoken "box"
    = "note"i
    / "abox"i
    / "rbox"i
    / "box"i

attributelist
    = attributes:((a:attribute "," {return a})* (a:attribute {return a}))
    {
      return parserHelpers.optionArray2Object(attributes[0].concat(attributes[1]));
    }

attribute
    = _ name:attributename _ "=" _ value:identifier _
    {
      var lAttribute = {};
      lAttribute[name.toLowerCase().replace("colour", "color")] = value;
      return lAttribute
    }

attributename  "attribute name"
    = "label"i
    / "idurl"i
    / "id"i
    / "url"i
    / "linecolor"i      / "linecolour"i
    / "textcolor"i      / "textcolour"i
    / "textbgcolor"i    / "textbgcolour"i
    / "arclinecolor"i   / "arclinecolour"i
    / "arctextcolor"i   / "arctextcolour"i
    / "arctextbgcolor"i / "arctextbgcolour"i
    / "arcskip"i

string "double quoted string"
    = '"' s:stringcontent '"' {return s.join("")}

stringcontent
    = (!'"' c:('\\"'/ .) {return c})*

identifier "identifier"
    = quotelessidentifier
    / string

quotelessidentifier
    = (letters:([A-Za-z_0-9])+ {return letters.join("")})

whitespace "whitespace"
    = c:[ \t] {return c}

lineend "lineend"
    = c:[\r\n] {return c}


/* comments - multi line */
mlcomstart = "/*"
mlcomend   = "*/"
mlcomtok   = !"*/" c:. {return c}
mlcomment
    = start:mlcomstart com:(mlcomtok)* end:mlcomend
    {
      return start + com.join("") + end
    }

/* comments - single line */
slcomstart = "//" / "#"
slcomtok   = [^\r\n]
slcomment
    = start:(slcomstart) com:(slcomtok)*
    {
      return start + com.join("")
    }

/* comments in general */
comment "comment"
    = slcomment
    / mlcomment

_
   = (whitespace / lineend/ comment)*

numberlike "number"
    = s:numberlikestring { return s; }
    / i:number { return i.toString(); }

numberlikestring
    = '"' s:number '"' { return s.toString(); }

number
    = real
    / cardinal

cardinal "cardinal"
    = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

real "real"
    = digits:(cardinal "." cardinal) { return parseFloat(digits.join("")); }

booleanlike "boolean"
    = bs:booleanlikestring {return bs;}
    / b:boolean {return b.toString();}

booleanlikestring
    = '"' s:boolean '"' { return s; }

boolean
    = "true"i
    / "false"i
    / "on"i
    / "off"i
    / "0"
    / "1"
/*
 This file is part of mscgen_js.

 mscgen_js is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 mscgen_js is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with mscgen_js.  If not, see <http://www.gnu.org/licenses/>.
 */
