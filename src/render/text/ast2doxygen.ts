import type { ISequenceChart } from "../../parse/mscgenjsast";
import { MscGenAdaptor } from "./ast2mscgen";

class DoxygenAdaptor extends MscGenAdaptor {
  public init() {
    const INDENT = "  ";
    const EOL = "\n";
    const LINE_PREFIX = " * ";

    super.init({
      program: {
        opener: `${LINE_PREFIX}\\msc${EOL}`,
        closer: `${LINE_PREFIX}\\endmsc`,
      },
      option: {
        opener: LINE_PREFIX + INDENT,
        separator: `,${EOL}${LINE_PREFIX}${INDENT}`,
        closer: `;${EOL}${LINE_PREFIX}${EOL}`,
      },
      entity: {
        opener: LINE_PREFIX + INDENT,
        separator: `,${EOL}${LINE_PREFIX}${INDENT}`,
        closer: `;${EOL}${LINE_PREFIX}${EOL}`,
      },
      arcline: {
        opener: LINE_PREFIX + INDENT,
        separator: `,${EOL}${LINE_PREFIX}${INDENT}`,
        closer: `;${EOL}`,
      },
      inline: {
        opener: `;${EOL}`,
        closer: `${LINE_PREFIX}#`,
      },
    });
  }

  public renderComments() {
    /* rendering comments within comments, that are eventually output
     * to doxygen html - don't think that's going to be necessary
     * or desired functionality. If it is remember to be able to
     * - have a solution for nested comments (otherwise: interesting results)
     * - have a solution for comments that have an other meaning (# this is
     *    a comment -> doxygen translates this as markdown title)
     * - handling languages different from c/ java/ d that have alternative
     *   comment/ documentation sections
     */
    return "";
  }
}

export const render = (pAST: ISequenceChart) => {
  const lAdaptor = new DoxygenAdaptor(false);
  return lAdaptor.render(pAST);
};
