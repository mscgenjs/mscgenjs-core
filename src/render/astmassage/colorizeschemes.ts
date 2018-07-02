export interface IColorAttributes {
    linecolor: string;
    textcolor: string;
    textbgcolor: string;
}

export interface IColorScheme {
    entityColors: IColorAttributes[];
    arcColors: any;
    aggregateArcColors: any;
}
export default {
    minimal: {
        entityColors: [
            {},
        ],
        arcColors: {
            "note": {
                linecolor: "black",
                textbgcolor: "#FFFFCC",
            },
            "---": {
                linecolor: "grey",
                textbgcolor: "white",
            },
            ">>": {
                linecolor: "#555",
            },
            "<<": {
                linecolor: "#555",
            },
            "-x": {
                linecolor: "#500",
            },
            "x-": {
                linecolor: "#500",
            },
        },
        aggregateArcColors: {
            inline_expression: {
                linecolor: "grey",
            },
            box: {
                linecolor: "black",
                textbgcolor: "white",
            },
        },
    },
    rosy: {
        entityColors: [
            {
                linecolor: "maroon",
                textbgcolor: "#FFFFCC",
            },
        ],
        arcColors: {
            "note": {
                linecolor: "maroon",
                textbgcolor: "#FFFFCC",
            },
            "---": {
                linecolor: "grey",
                textbgcolor: "white",
            },
        },
        aggregateArcColors: {
            inline_expression: {
                linecolor: "maroon",
                textcolor: "maroon",
            },
            box: {
                linecolor: "maroon",
                textbgcolor: "#FFFFCC",
            },
        },
    },
    bluey: {
        entityColors: [
            {
                linecolor: "#00A1DE",
                textbgcolor: "#00A1DE",
                textcolor: "white",
            },
        ],
        arcColors: {
            "note": {
                linecolor: "white",
                textbgcolor: "#E77B2F",
                textcolor: "white",
            },
            "---": {
                linecolor: "#00A1DE",
                textcolor: "#005B82",
                textbgcolor: "white",
            },
        },
        aggregateArcColors: {
            inline_expression: {
                linecolor: "#00A1DE",
                textcolor: "#005B82",
            },
            box: {
                linecolor: "#00A1DE",
                textbgcolor: "white",
                textcolor: "#005B82",
            },
            emptyarc: {
                textcolor:  "#005B82",
                linecolor:  "#005B82",
            },
            directional: {
                textcolor:  "#005B82",
                linecolor:  "#005B82",
            },
            bidirectional: {
                textcolor:  "#005B82",
                linecolor:  "#005B82",
            },
            nondirectional: {
                textcolor:  "#005B82",
                linecolor:  "#005B82",
            },
        },
    },
    auto: {
        entityColors: [
            {
                linecolor: "#008800",
                textbgcolor: "#CCFFCC",
            },
            {
                linecolor: "#FF0000",
                textbgcolor: "#FFCCCC",
            },
            {
                linecolor: "#0000FF",
                textbgcolor: "#CCCCFF",
            },
            {
                linecolor: "#FF00FF",
                textbgcolor: "#FFCCFF",
            },
            {
                linecolor: "black",
                textbgcolor: "#DDDDDD",
            },
            {
                linecolor: "orange",
                textbgcolor: "#FFFFCC",
            },
            {
                linecolor: "#117700",
                textbgcolor: "#00FF00",
            },
            {
                linecolor: "purple",
                textbgcolor: "violet",
            },
            {
                linecolor: "grey",
                textbgcolor: "white",
            },
        ],
        arcColors: {
            "note": {
                linecolor: "black",
                textbgcolor: "#FFFFCC",
            },
            "---": {
                linecolor: "grey",
                textbgcolor: "white",
            },
        },
        aggregateArcColors: {
            inline_expression: {
                linecolor: "grey",
                textbgcolor: "white",
            },
            box: {
                linecolor: "black",
                textbgcolor: "white",
            },
        },
    },
};
