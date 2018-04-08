/*
 * parser for xù (messsage sequence chart language)
 *
 * xù is an extension of mscgen, which means each valid mscgen
 * script is also a valid xù script
 *
 * see https://github.com/sverweij/mscgen_js/wikum/xu.md for more information
 * - mscgen cannot handle entity names that are also keywords
 *   (box, abox, rbox, note, msc, hscale, width, arcgradient,
 *   wordwraparcs, label, color, idurl, id, url,
 *   linecolor, linecolour, textcolor, textcolour,
 *   textbgcolor, textbgcolour, arclinecolor, arclinecolour,
 *   arctextcolor, arctextcolour,arctextbgcolor, arctextbgcolour,
 *   arcskip). This grammar does allow them.
 */

program
    =  pre:_ starttoken _  "{" _ declarations:declarationlist _ "}" _
    {
        declarations.entities = declarations.entities || [];
        parserHelpers.checkForUndeclaredEntities(declarations.entities, declarations.arcs);

        declarations = _.assign ({meta: parserHelpers.getMetaInfo(declarations.options, declarations.arcs)}, declarations);

        if (pre.length > 0) {
            declarations = _.assign({precomment: pre}, declarations);
        }

        return declarations;
    }

starttoken
    = "msc"i
    / "xu"i

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
        // make the option array into an options object
        return options[0].concat(options[1]).reduce(_.assign, {})
    }

option "option"
    = _ name:("hscale"i/ "arcgradient"i) _ "=" _ value:numberlike _
        {
            return parserHelpers.nameValue2Option(name, value);
        }
    / _ name:"width"i _ "=" _ value:sizelike _
        {
            return parserHelpers.nameValue2Option(name, value);
        }
    / _ name:"wordwraparcs"i _ "=" _ value:booleanlike _
        {
            return parserHelpers.nameValue2Option(name, parserHelpers.flattenBoolean(value));
        }
    / _ name:"wordwrapentities"i _ "=" _ value:booleanlike _
        {
            return parserHelpers.nameValue2Option(name, parserHelpers.flattenBoolean(value));
        }
    / _ name:"wordwrapboxes"i _ "=" _ value:booleanlike _
        {
            return parserHelpers.nameValue2Option(name, parserHelpers.flattenBoolean(value));
        }
    / _ name:"watermark"i _ "=" _ value:string _
        {
            return parserHelpers.nameValue2Option(name, value);
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
            error("MscGen keywords aren't allowed as entity names (embed them in quotes if you need them)");
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
    = regulararc
    / spanarc

regulararc
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
    / (_ "*" _ kind:bckarrowtoken _ to:identifier _
        {return {kind:kind, from: "*", to:to}})
    /(_ from:identifier _ kind:fwdarrowtoken _ "*" _
        {return {kind:kind, from: from, to:"*"}})
    /(_ from:identifier _ kind:bidiarrowtoken _ "*" _
        {return {kind:kind, from: from, to:"*"}})

spanarc
    = (_ from:identifier _ kind:spanarctoken _ to:identifier _ al:("[" al:attributelist "]" {return al})? _ "{" _ arclist:arclist? _ "}" _
        {
            return _.assign (
                {
                    kind     : kind,
                    from     : from,
                    to       : to,
                    arcs     : arclist
                },
                al
            );
        }
    )

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

spanarctoken "inline expression"
    = kind:(
          "alt"i
        / "else"i
        / "opt"i
        / "break"i
        / "par"i
        / "seq"i
        / "strict"i
        / "neg"i
        / "critical"i
        / "ignore"i
        / "consider"i
        / "assert"i
        / "loop"i
        / "ref"i
        / "exc"i
     )
    {
        return kind.toLowerCase()
    }

attributelist
    = attributes:((a:attribute "," {return a})* (a:attribute {return a}))
    {
        // transform the array of attributes into an object
        return attributes[0].concat(attributes[1]).reduce(_.assign, {});
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
    / "title"i

string "double quoted string" // used in watermark messages. Not yet in thos for label attributes
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

cardinal
    = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

real
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

sizelike "size"
    = sizelikestring
    / size

sizelikestring
    = '"' s:size '"' { return s; }

size
    = n:number {return n.toString(); }
    / s:"auto"i {return s.toLowerCase(); }
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
