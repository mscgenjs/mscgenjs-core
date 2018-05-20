const colorize = require("../../../src/render/astmassage/colorize");
const fix      = require("../../astfixtures.json");
const _        = require("../../../src/lib/lodash/lodash.custom");

const textColoredEntity = {
    "meta": {
        "extendedOptions": false,
        "extendedArcTypes": false,
        "extendedFeatures": false
    },
    "entities": [
        {
            "name": "a",
            "textcolor": "green"
        }
    ]
};

const arcTextColoredEntity = {
    "meta": {
        "extendedOptions": false,
        "extendedArcTypes": false,
        "extendedFeatures": false
    },
    "entities": [
        {
            "name": "a",
            "arctextcolor": "green"
        }
    ]
};

const textColoredEntityWithArc = {
    "meta": {
        "extendedOptions": false,
        "extendedArcTypes": false,
        "extendedFeatures": false
    },
    "entities": [
        {
            "name": "a",
            "textcolor": "green"
        }
    ],
    "arcs": [
        [
            {
                "kind": "=>",
                "from": "a",
                "to": "a"
            }
        ]
    ]
};

const boxes = {
    "meta": {
        "extendedOptions": false,
        "extendedArcTypes": false,
        "extendedFeatures": false
    },
    "entities": [
        {
            "name": "a",
            "textcolor": "green"
        }
    ],
    "arcs": [
        [
            {
                "kind": "box",
                "from": "a",
                "to": "a"
            }
        ],
        [
            {
                "kind": "abox",
                "from": "a",
                "to": "a"
            }
        ],
        [
            {
                "kind": "rbox",
                "from": "a",
                "to": "a"
            }
        ],
        [
            {
                "kind": "note",
                "from": "a",
                "to": "a"
            }
        ]
    ]
};

const coloredBoxes = {
    "meta": {
        "extendedOptions": false,
        "extendedArcTypes": false,
        "extendedFeatures": false
    },
    "entities": [
        {
            "name": "a",
            "textcolor": "green"
        }
    ],
    "arcs": [
        [
            {
                "kind": "box",
                "from": "a",
                "to": "a",
                "linecolor": "black",
                "textbgcolor": "white"
            }
        ],
        [
            {
                "kind": "abox",
                "from": "a",
                "to": "a",
                "linecolor": "black",
                "textbgcolor": "white"
            }
        ],
        [
            {
                "kind": "rbox",
                "from": "a",
                "to": "a",
                "linecolor": "black",
                "textbgcolor": "white"
            }
        ],
        [
            {
                "kind": "note",
                "from": "a",
                "to": "a",
                "linecolor": "black",
                "textbgcolor": "#FFFFCC"
            }
        ]
    ]
};

const coloredBoxesForced = {
    "meta": {
        "extendedOptions": false,
        "extendedArcTypes": false,
        "extendedFeatures": false
    },
    "entities": [
        {
            "name": "a",
            "linecolor": "#008800",
            "textbgcolor": "#CCFFCC",
            "arclinecolor": "#008800"
        }
    ],
    "arcs": [
        [
            {
                "kind": "box",
                "from": "a",
                "to": "a",
                "linecolor": "black",
                "textbgcolor": "white"
            }
        ],
        [
            {
                "kind": "abox",
                "from": "a",
                "to": "a",
                "linecolor": "black",
                "textbgcolor": "white"
            }
        ],
        [
            {
                "kind": "rbox",
                "from": "a",
                "to": "a",
                "linecolor": "black",
                "textbgcolor": "white"
            }
        ],
        [
            {
                "kind": "note",
                "from": "a",
                "to": "a",
                "linecolor": "black",
                "textbgcolor": "#FFFFCC"
            }
        ]
    ]
};

const boxesWithNonColoredEntity = {
    "meta": {
        "extendedOptions": false,
        "extendedArcTypes": false,
        "extendedFeatures": false
    },
    "entities": [
        {
            "name": "a"
        }
    ],
    "arcs": [
        [
            {
                "kind": "box",
                "from": "a",
                "to": "a"
            }
        ],
        [
            {
                "kind": "abox",
                "from": "a",
                "to": "a"
            }
        ],
        [
            {
                "kind": "rbox",
                "from": "a",
                "to": "a"
            }
        ],
        [
            {
                "kind": "note",
                "from": "a",
                "to": "a"
            }
        ]
    ]
};


const coloredBoxesWithNonColoredEntity = {
    "meta": {
        "extendedOptions": false,
        "extendedArcTypes": false,
        "extendedFeatures": false
    },
    "entities": [
        {
            "name": "a",
            "linecolor": "#008800",
            "textbgcolor": "#CCFFCC",
            "arclinecolor": "#008800"
        }
    ],
    "arcs": [
        [
            {
                "kind": "box",
                "from": "a",
                "to": "a",
                "linecolor": "black",
                "textbgcolor": "white"
            }
        ],
        [
            {
                "kind": "abox",
                "from": "a",
                "to": "a",
                "linecolor": "black",
                "textbgcolor": "white"
            }
        ],
        [
            {
                "kind": "rbox",
                "from": "a",
                "to": "a",
                "linecolor": "black",
                "textbgcolor": "white"
            }
        ],
        [
            {
                "kind": "note",
                "from": "a",
                "to": "a",
                "linecolor": "black",
                "textbgcolor": "#FFFFCC"
            }
        ]
    ]
};

const alreadyColoredBoxes = {
    "meta": {
        "extendedOptions": false,
        "extendedArcTypes": false,
        "extendedFeatures": false
    },
    "entities": [
        {
            "name": "a",
            "arclinecolor": "cyan"
        }
    ],
    "arcs": [
        [
            {
                "kind": "box",
                "from": "a",
                "to": "a",
                "linecolor": "red",
                "textbgcolor": "orange",
                "label": "remains orange"
            }
        ],
        [
            {
                "kind": "abox",
                "from": "a",
                "to": "a",
                "linecolor": "orange",
                "textbgcolor": "red",
                "textcolor": "white",
                "label": "remains red"
            }
        ],
        [
            {
                "kind": "rbox",
                "from": "a",
                "to": "a",
                "linecolor": "black",
                "textbgcolor": "white",
                "textcolor": "fuchsia",
                "label": "remains black and white"
            }
        ],
        [
            {
                "kind": "note",
                "from": "a",
                "to": "a",
                "linecolor": "blue",
                "textbgcolor": "cyan",
                "textcolor": "black",
                "label": "remains blue"
            }
        ]
    ]
};

const customScheme = {
    "entityColors": [
        {
            "linecolor" : "#FF0000",
            "textbgcolor" : "red",
            "textcolor": "white"
        }, {
            "linecolor" : "#AAAAAA",
            "textbgcolor" : "white"
        }, {
            "linecolor" : "#0000FF",
            "textbgcolor" : "blue",
            "textcolor": "#111111"
        }
    ],
    "arcColors" : {
        "note" : {
            "linecolor" : "#AA0000",
            "textbgcolor" : "#FFFFCC",
            "textcolor": "#AA0000"
        },
        "rbox" : {
            "linecolor" : "#000000",
            "textbgcolor" : "#333333",
            "textcolor": "#FFFFFF"
        }
    },
    "aggregateArcColors":{
        "inline_expression" : {
            "linecolor" : "grey",
            "textbgcolor" : "white"
        },
        "box" : {
            "linecolor" : "black",
            "textbgcolor" : "white"
        }
    }
};

const customMscTestInput = {
    "meta": {
        "extendedOptions": false,
        "extendedArcTypes": false,
        "extendedFeatures": false
    },
    "options": {
        "arcgradient": "10",
        "wordwraparcs": "true"
    },
    "entities": [
        {
            "name": "a"
        },
        {
            "name": "b"
        },
        {
            "name": "c"
        },
        {
            "name": "d"
        },
        {
            "name": "e"
        }
    ],
    "arcs": [
        [
            {
                "kind": "note",
                "from": "b",
                "to": "d",
                "label": "colors should star cycling at d"
            }
        ],
        [
            {
                "kind": "=>>",
                "from": "a",
                "to": "b",
                "label": "here's some text that should get colored"
            }
        ],
        [
            {
                "kind": "=>>",
                "from": "b",
                "to": "c",
                "label": "here's some more text, expected to have an other color"
            }
        ],
        [
            {
                "kind": "=>>",
                "from": "c",
                "to": "*",
                "label": "colors y'all!"
            }
        ],
        [
            {
                "kind": "<<",
                "from": "b",
                "to": "d",
                "label": "colored in d's color"
            }
        ],
        [
            {
                "kind": ">>",
                "from": "e",
                "to": "b",
                "label": "colored in e's color"
            }
        ],
        [
            {
                "kind": "rbox",
                "from": "b",
                "to": "b",
                "label": "some reflection"
            }
        ],
        [
            {
                "kind": ">>",
                "from": "b",
                "to": "a",
                "label": "reflected colore things"
            }
        ]
    ]
};
const customMscTestOutput = {
    "meta": {
        "extendedOptions": false,
        "extendedArcTypes": false,
        "extendedFeatures": false
    },
    "options": {
        "arcgradient": "10",
        "wordwraparcs": "true"
    },
    "entities": [
        {
            "name": "a",
            "linecolor": "#FF0000",
            "textbgcolor": "red",
            "textcolor": "white",
            "arctextcolor": "white",
            "arclinecolor": "#FF0000"
        },
        {
            "name": "b",
            "linecolor": "#AAAAAA",
            "textbgcolor": "white",
            "arclinecolor": "#AAAAAA"
        },
        {
            "name": "c",
            "linecolor": "#0000FF",
            "textbgcolor": "blue",
            "textcolor": "#111111",
            "arctextcolor": "#111111",
            "arclinecolor": "#0000FF"
        },
        {
            "name": "d",
            "linecolor": "#FF0000",
            "textbgcolor": "red",
            "textcolor": "white",
            "arctextcolor": "white",
            "arclinecolor": "#FF0000"
        },
        {
            "name": "e",
            "linecolor": "#AAAAAA",
            "textbgcolor": "white",
            "arclinecolor": "#AAAAAA"
        }
    ],
    "arcs": [
        [
            {
                "kind": "note",
                "from": "b",
                "to": "d",
                "label": "colors should star cycling at d",
                "linecolor": "#AA0000",
                "textcolor": "#AA0000",
                "textbgcolor": "#FFFFCC"
            }
        ],
        [
            {
                "kind": "=>>",
                "from": "a",
                "to": "b",
                "label": "here's some text that should get colored"
            }
        ],
        [
            {
                "kind": "=>>",
                "from": "b",
                "to": "c",
                "label": "here's some more text, expected to have an other color"
            }
        ],
        [
            {
                "kind": "=>>",
                "from": "c",
                "to": "*",
                "label": "colors y'all!"
            }
        ],
        [
            {
                "kind": "<<",
                "from": "b",
                "to": "d",
                "label": "colored in d's color"
            }
        ],
        [
            {
                "kind": ">>",
                "from": "e",
                "to": "b",
                "label": "colored in e's color"
            }
        ],
        [
            {
                "kind": "rbox",
                "from": "b",
                "to": "b",
                "label": "some reflection",
                "linecolor": "#000000",
                "textcolor": "#FFFFFF",
                "textbgcolor": "#333333"
            }
        ],
        [
            {
                "kind": ">>",
                "from": "b",
                "to": "a",
                "label": "reflected colore things"
            }
        ]
    ]
};

describe('render/text/colorize', () => {
    describe('#colorize', () => {
        test('should return the input on uncolor(colorize)', () => {
            expect(
                colorize.uncolor(colorize.applyScheme(_.cloneDeep(fix.astAltWithinLoop)))
            ).toEqual(fix.astAltWithinLoop);
        });
        test('should, leave already textcolored entities alone', () => {
            expect(
                colorize.applyScheme(_.cloneDeep(textColoredEntity))
            ).toEqual(textColoredEntity);
        });
        test('should, leave already textcolored entities alone', () => {
            expect(
                colorize.applyScheme(_.cloneDeep(textColoredEntity), 'auto')
            ).toEqual(textColoredEntity);
        });
        test('should, leave already arctextcolored entities alone', () => {
            expect(
                colorize.applyScheme(arcTextColoredEntity)
            ).toEqual(arcTextColoredEntity);
        });
        test(
            'should, leave regular arcs departing from already textcolored entities alone',
            () => {
                expect(
                    colorize.applyScheme(textColoredEntityWithArc)
                ).toEqual(textColoredEntityWithArc);
            }
        );
        test('should color box arcs departing from colored entities', () => {
            expect(
                colorize.applyScheme(_.cloneDeep(boxes))
            ).toEqual(coloredBoxes);
        });
        test('should not respect any colors when force is applied', () => {
            expect(
                colorize.applyScheme(_.cloneDeep(boxes), 'auto', true)
            ).toEqual(coloredBoxesForced);
        });
        test('should not respect any colors when force is applied', () => {
            const lRosedBoxes = colorize.applyScheme(_.cloneDeep(boxes), 'rosy');
            expect(
                colorize.applyScheme(lRosedBoxes, 'auto', true)
            ).toEqual(coloredBoxesForced);
        });
        test('should color box arcs departing from non-colored entities', () => {
            expect(
                colorize.applyScheme(boxesWithNonColoredEntity)
            ).toEqual(coloredBoxesWithNonColoredEntity);
        });
        test('should not color box arcs already having some color', () => {
            expect(
                colorize.applyScheme(alreadyColoredBoxes)
            ).toEqual(alreadyColoredBoxes);
        });
        test(
            'should use custom entity color scheme and arc specifics when passed these',
            () => {
                expect(
                    colorize.colorize(customMscTestInput, customScheme)
                ).toEqual(customMscTestOutput);
            }
        );
    });
});
