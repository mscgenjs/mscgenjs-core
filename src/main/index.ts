import * as mscgen from "../../types/mscgen";

import allowedValues from "./allowedvalues";
import normalizeOptions from "./normalizeoptions";
const $version = require("../version.json");

function isProbablyAnASTAlready(pScript: string, pInputType: mscgen.InputType) {
  return pInputType === "json" && typeof pScript === "object";
}

function getAST(
  pScript: string,
  pInputType: mscgen.InputType,
  pGetParser: (pInputType: mscgen.InputType) => mscgen.IParser
) {
  if (isProbablyAnASTAlready(pScript, pInputType)) {
    return pScript;
  } else {
    return pGetParser(pInputType).parse(pScript);
  }
}

function runCallBack(
  pCallBack: (pError: Error | null, pResult?: string | null) => void,
  pError: Error | null,
  pResult?: string | null
) {
  /* istanbul ignore else */
  if (Boolean(pCallBack)) {
    if (Boolean(pError)) {
      pCallBack(pError, null);
    } else {
      pCallBack(null, pResult);
    }
  }
}

export function renderMsc(
  pScript: string,
  pOptions: mscgen.IRenderOptions,
  pCallBack: (pError: Error | null, pResult?: string | null) => void,
  pGetParser: (pInputType: mscgen.InputType) => mscgen.IParser,
  pGetGraphicsRenderer: () => any
) {
  const lOptions = normalizeOptions(pOptions, pScript);

  try {
    runCallBack(
      pCallBack,
      null,
      pGetGraphicsRenderer().render(
        getAST(pScript, lOptions.inputType, pGetParser),
        lOptions.window,
        lOptions.elementId,
        {
          source: lOptions.source,
          styleAdditions: lOptions.styleAdditions,
          additionalTemplate: lOptions.additionalTemplate,
          mirrorEntitiesOnBottom: lOptions.mirrorEntitiesOnBottom,
          regularArcTextVerticalAlignment:
            lOptions.regularArcTextVerticalAlignment,
        }
      )
    );
  } catch (pException: any) {
    runCallBack(pCallBack, pException);
  }
}

export function translateMsc(
  pScript: string,
  pOptions: mscgen.ITranslateOptions,
  pGetParser: (pInputType: mscgen.InputType) => mscgen.IParser,
  pGetTextRenderer: (pOutputType: mscgen.OutputType) => mscgen.IRenderer
) {
  const lOptions = Object.assign(
    {
      inputType: "mscgen",
      outputType: "json",
    },
    pOptions
  );

  if (lOptions.outputType === "ast") {
    return pGetParser(lOptions.inputType).parse(pScript);
  }
  if (lOptions.outputType === "json") {
    return JSON.stringify(
      pGetParser(lOptions.inputType).parse(pScript),
      null,
      "  "
    );
  }
  return pGetTextRenderer(lOptions.outputType).render(
    getAST(pScript, lOptions.inputType, pGetParser)
  );
}

export const version = $version.version;

export function getAllowedValues(): mscgen.IAllowedValues {
  return allowedValues;
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
