import { ArcKindAggregatedType, ArcKindClassType, ArcKindType } from "../../parse/mscgenjsast";
import aggregatekind from "../astmassage/aggregatekind";

const KIND2CLASS = Object.freeze({
    "|||"   : "empty-row",
    "..."   : "omitted-row",
    "---"   : "comment-row",
    "->"    : "signal",
    "=>"    : "method",
    "=>>"   : "callback",
    ">>"    : "return",
    ":>"    : "emphasised",
    "-x"    : "lost",
    "<-"    : "signal",
    "<="    : "method",
    "<<="   : "callback",
    "<<"    : "return",
    "<:"    : "emphasised",
    "x-"    : "lost",
    "<->"   : "signal",
    "<=>"   : "method",
    "<<=>>" : "callback",
    "<<>>"  : "return",
    "<:>"   : "emphasised",
    "--"    : "signal",
    "=="    : "method",
    ".."    : "return",
    "::"    : "emphasised",
});

export function getClass(pKey: ArcKindType): ArcKindClassType {
    return KIND2CLASS[pKey] || pKey;
}

export function getAggregateClass(pKey: ArcKindType): ArcKindAggregatedType {
    return aggregatekind(pKey) || pKey;
}
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
