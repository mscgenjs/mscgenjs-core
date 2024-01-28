import type { IRenderOptions, ITranslateOptions } from "../types/mscgen";
import * as main from "./main";
import * as resolver from "./main/lazy-resolver";

/**
 * Exactly the same interface as @index.js - the only difference is that the
 * functions only load dependencies at the moment they need them.
 */
module.exports = {
  /**
   * See the function of the same name in @index.js.
   */
  renderMsc(
    pScript: string,
    pOptions: IRenderOptions,
    pCallBack: (pError: Error | null, pResult?: string | null) => void
  ): void {
    main.renderMsc(
      pScript,
      pOptions || {},
      pCallBack,
      resolver.getParser,
      resolver.getGraphicsRenderer
    );
  },

  /**
   * See the function of the same name in @index.js.
   */
  translateMsc(pScript: string, pOptions?: ITranslateOptions): string {
    return main.translateMsc(
      pScript,
      pOptions || {},
      resolver.getParser,
      resolver.getTextRenderer
    );
  },

  /**
   * See the variable of the same name in @index.js.
   */
  version: main.version,

  /**
   * See the variable of the same name in @index.js.
   */
  getAllowedValues: main.getAllowedValues,

  /**
   * See the function of the same name in @index.js
   */
  getParser: resolver.getParser,

  /**
   * See the function of the same name in @index.js
   */
  getGraphicsRenderer: resolver.getGraphicsRenderer,

  /**
   * See the function of the same name in @index.js
   */
  getTextRenderer: resolver.getTextRenderer,
};
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
