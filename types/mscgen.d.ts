export type InputType =
    "mscgen"  |
    "msgenny" |
    "xu"      |
    "json"
;

export type RegularArcTextVerticalAlignmentType =
    "above"  |
    "middle" |
    "below"
;

interface IRenderOptions {
    /**
     * the id of the DOM element to render in. Defaults to
     * "__svg". renderMsc assumes this element to exist.
     */
    elementId?: string;

    /**
     * language to parse - default "mscgen"
     */
    inputType?: InputType;

    /**
     * draws entities on both top and bottom of
     * the chart when true. Defaults to false.
     */
    mirrorEntitiesOnBottom?: boolean;

    /**
     * identifier of an additional template. Get the
     * allowed values from allowedValues.namedStyle
     */
    additionalTemplate?: string;

    /**
     * whether the generated svg should include the script
     * in a desc element or not. Defaults to false
     */
    includeSource?: boolean;

    /**
     * the vertical alignment type to use
     * defaults to "middle"
     */
    regularArcTextVerticalAlignment?: RegularArcTextVerticalAlignmentType;

    /**
     * a string with (css) style additions
     */
    styleAdditions?: string | null,

    /**
     * the window object to use for rendering - takes the browser window by default
     */
    window?: any
}

interface INormalizedRenderOptions {
    /**
     * the id of the DOM element to render in. Defaults to
     * "__svg". renderMsc assumes this element to exist.
     */
    elementId: string;

    /**
     * language to parse - default "mscgen"
     */
    inputType: InputType;

    /**
     * draws entities on both top and bottom of
     * the chart when true. Defaults to false.
     */
    mirrorEntitiesOnBottom: boolean;

    /**
     * identifier of an additional template. Get the
     * allowed values from allowedValues.namedStyle
     */
    additionalTemplate: string;

    /**
     * whether the generated svg should include the script
     * in a desc element or not. Defaults to false
     */
    includeSource: boolean;

    /**
     * the vertical alignment type to use
     * defaults to "middle"
     */
    regularArcTextVerticalAlignment: RegularArcTextVerticalAlignmentType;

    /**
     * a string with (css) style additions
     */
    styleAdditions: string | null,

    /**
     * the window object to use for rendering - takes the browser window by default
     */
    window: any,

    /**
     * source code to attach to any output that wants it. 
     * Derived attribute; automatically assigned from the includeSource
     * boolean during 'normalization' in main
     */
    source: string | null
}
/**
 * parses the given script and renders it in the DOM element with
 * id pOptions.elementId.
 *
 * @param  {string} pScript     The script to parse and render. Assumed
 *                              to be MscGen - unless specified
 *                              differently in pOptions.inputType
 * @param  {IRenderOptions} pOptions options influencing parsing and
 *                              rendering. See below for the complete
 *                              list.
 * @param  {function} pCallBack function with error, success
 *                              parameters. renderMsc will pass the
 *                              resulting svg in the success parameter
 *                              when successful, the error message
 *                              in the error parameter when not.
 * @return none
 *
 */
export function renderMsc(
    pScript: string,
    pOptions?: IRenderOptions,
    pCallBack?: (pError: Error, pSuccess: string) => void,
): void;

export type OutputType =
    "mscgen"  |
    "msgenny" |
    "xu"      |
    "json"    |
    "ast"     |
    "dot"     |
    "doxygen"
;

interface ITranslateOptions {
    /**
     * the language of pScript defaults to "mscgen".
     */
    inputType?: InputType;

    /**
     * defaults to "json".
     */
    outputType?: OutputType;
}
/**
 * Translates the input script to an outputscript.
 *
 * @param  {string} pScript     The script to translate
 * @param  {object} pOptions    options influencing parsing & rendering.
 *                              See below for the complete list.
 * @param  {function} pCallBack function with error, success
 *                              parameters. translateMsc will pass the
 *                              resulting script in the success
 *                              parameter when successful, the error
 *                              message in the error parameter when not.
 * @return none
 *
 * Options:
 *   inputType  :
 *   outputType : defaults to "json". Possible values:
 *                allowedValues.outputType
 */
export function translateMsc(
    pScript: string,
    pOptions?: ITranslateOptions,
): string;

/**
 * The current (semver compliant) version number string of
 * mscgenjs
 *
 * @type {string}
 */
export const version: string;

export interface IValueDetails {

    /**
     * The value
     */
    name: string;

    /**
     * if true the value reflects an experimental feature
     * it's probably stable, but might change behavior or
     * disappear in a next release (patch, minor or major)
     * (defaults to false)
     */
    experimental: boolean;

    /**
     * A description of the value you can use to describe
     * it to end users
     */
    description?: string;

    /**
     * true if the value is going to disappear in the next
     * major release
     */
    deprecated?: boolean;
}

export interface IAllowedValues {
    inputType: IValueDetails[];
    outputType: IValueDetails[];
    namedStyle: IValueDetails[];
    regularArcTextVerticalAlignment: IValueDetails[];
}
/**
 * An object with arrays of allowed values for parameters in the
 * renderMsc and translateMsc functions. Each entry in these
 * arrays have a name (=the allowed value) and a boolean "experimental"
 * attribute. If that attribute is true, you'll hit a feature that is
 * under development when use that value.
 */
export function getAllowedValues(): IAllowedValues;

interface IParser {
    /**
     * A parser that takes a sequence chart description and
     * outputs an abstract syntax tree.
     *
     * @param {string} pSource - the source code to parse
     * @throws {Error} - a parse error
     * @return {any} - an abstract syntax tree
     */
    parse: (pSource: string) => any;
}

interface IRenderer {
    /**
     * A parser that takes a sequence chart description and
     * outputs an abstract syntax tree.
     *
     * @param {string} pSource - the source code to parse
     * @throws {Error} - a parse error
     * @return {any} - an abstract syntax tree
     */
    render: (pSomething: any) => any;
}
/**
 * returns a parser module for the given language. The module exposes
 * a parse(pString) function which returns an abstract syntax tree in
 * json format as described in the link below.
 *
 * https://github.com/mscgenjs/mscgenjs-core/blob/master/parse/README.md#the-abstract-syntax-tree
 *
 * @param {string} pLanguage the language to get a parser for
 *                           Possible values: "mscgen", "msgenny", "xu"
 *                           "json". Defaults to "mscgen"
 * @return {IParser}
 */
export function getParser(pLanguage?: InputType): IParser;
