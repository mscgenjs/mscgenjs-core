export interface IMeta {
    extendedOptions: boolean;
    extendedArcTypes: boolean;
    extendedFeatures: boolean;
}

export interface IOptions {
    hscale?: string;
    arcgradient?: string;
    width?: string;
    wordwraparcs?: boolean;
    wordwrapentities?: boolean;
    wordwrapboxes?: boolean;
    watermark?: string;
}

export interface IOptionsNormalized {
    hscale?: string;
    arcgradient?: string;
    width?: string;
    wordwraparcs: boolean;
    wordwrapentities: boolean;
    wordwrapboxes: boolean;
    watermark?: string;
}

export interface IEntity {
    name: string;
    label?: string;
    id?: string;
    idurl?: string;
    url?: string;
    linecolor?: string;
    textcolor?: string;
    textbgcolor?: string;
    arclinecolor?: string;
    arctextcolor?: string;
    arctextbgcolor?: string;
    arcskip?: number;
    title?: string;
}

export interface IEntityNormalized {
    name: string;
    label: string;
    id?: string;
    idurl?: string;
    url?: string;
    linecolor?: string;
    textcolor?: string;
    textbgcolor?: string;
    arclinecolor?: string;
    arctextcolor?: string;
    arctextbgcolor?: string;
    arcskip?: number;
    title?: string;
}

export type ArcKindType =
    "|||"      | "..."    | "---" |
    "--"       | "<->"    |
    "=="       | "<=>"    | "<<=>>" |
    ".."       | "<<>>"   |
    "::"       | "<:>"    |
    "->"       | "<-"     |
    "=>>"      | "<<="    |
    "=>"       | "<="     |
    ">>"       | "<<"     |
    ":>"       | "<:"     |
    "-x"       | "x-"     |
    "box"      | "note"   | "abox"     | "rbox" |
    "alt"      | "else"   | "opt"      | "break" |
    "par"      | "seq"    | "strict"   | "neg" |
    "critical" | "ignore" | "consider" | "assert" |
    "loop"     | "ref"    | "exc";

export type ArcKindNormalizedType =
    "|||"      | "..."    | "---" |
    "--"       | "<->"    |
    "=="       | "<=>"    | "<<=>>" |
    ".."       | "<<>>"   |
    "::"       | "<:>"    |
    "->"       |
    "=>>"      |
    "=>"       |
    ">>"       |
    ":>"       |
    "-x"       |
    "box"      | "note"   | "abox"     | "rbox" |
    "alt"      | "else"   | "opt"      | "break" |
    "par"      | "seq"    | "strict"   | "neg" |
    "critical" | "ignore" | "consider" | "assert" |
    "loop"     | "ref"    | "exc";

export type ArcKindAggregatedType = 
    "emptyarc"    | "box"           |
    "directional" | "bidirectional" | "nondirectional" |
    "inline_expression"

export interface IArc {
    kind: ArcKindType;
    from?: string;
    to?: string;
    arcs?: IArc[];
    label?: string;
    id?: string;
    idurl?: string;
    url?: string;
    linecolor?: string;
    textcolor?: string;
    textbgcolor?: string;
    arclinecolor?: string;
    arctextcolor?: string;
    arctextbgcolor?: string;
    arcskip?: number;
    title?: string;
}

export interface ISequenceChart {
    precomment?: string[];
    meta: IMeta;
    options?: IOptions;
    entities: IEntity[];
    arcs?: IArc[];
}
