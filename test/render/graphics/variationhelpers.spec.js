var expect = require("chai").expect;
var geo    = require("../../../render/graphics/svgelementfactory/variationhelpers");

describe('#geometry', function() {

    describe('#getDirection', function () {
        it("returns -1,1,1 for (10,0),(0,10)", function(){
            expect(
                geo.getDirection(
                    {xFrom:10, yFrom:0, xTo:0, yTo:10}
                )
            ).to.deep.equal(
                {
                    signX: -1,
                    signY: 1,
                    dy: 1
                }
            );
        });
        it("returns -1,1,-Infinity for (0,0),(0,10)", function(){
            expect(
                geo.getDirection(
                    {xFrom:0, yFrom:0, xTo:0, yTo:10}
                )
            ).to.deep.equal(
                {
                    signX: -1,
                    signY: 1,
                    dy: -Infinity
                }
            );
        });
        it("returns -1,1,0 for (0,0),(10,0)", function(){
            expect(
                geo.getDirection(
                    {xFrom:0, yFrom:0, xTo:10, yTo:0}
                )
            ).to.deep.equal(
                {
                    signX: 1,
                    signY: -1,
                    dy: 0
                }
            );
        });
    });

    describe('#getLineLength', function () {
        it("returns 10 for (10,0), (10,10)", function(){
            expect(
                geo.getLineLength(
                    {xFrom:10, yFrom:0, xTo:10, yTo:10}
                )
            ).to.equal(10);
        });
        it("returns 10 for (0,10), (10,10)", function(){
            expect(
                geo.getLineLength(
                    {xFrom:0, yFrom:10, xTo:10, yTo:10}
                )
            ).to.equal(10);
        });
        it("returns ~14.1 for (10,0), (0,10)", function(){
            expect(
                geo.getLineLength(
                    {xFrom:10, yFrom:0, xTo:0, yTo:10}
                )
            ).to.equal(14.142135623730951);
        });
        it("returns 0 for (10,0), (0,10)", function(){
            expect(
                geo.getLineLength(
                    {xFrom:10, yFrom:-10, xTo:10, yTo:-10}
                )
            ).to.equal(0);
        });
    });

    describe('#getNumberOfSegments', function () {
        it("returns 1 to fit segments of 10 long into ((10,0), (0,10))", function(){
            expect(
                geo.getNumberOfSegments(
                    {xFrom:10, yFrom:0, xTo:0, yTo:10},
                    10
                )
            ).equal(1);
        });
        it("returns 14 to fit segments of 1 long into ((10,0), (0,10))", function(){
            expect(
                geo.getNumberOfSegments(
                    {xFrom:10, yFrom:0, xTo:0, yTo:10},
                    1
                )
            ).equal(14);
        });
        it("returns 14 to fit segments of 1 long into ((10,10), (0,0))", function(){
            expect(
                geo.getNumberOfSegments(
                    {xFrom:10, yFrom:10, xTo:0, yTo:0},
                    1
                )
            ).equal(14);
        });
        it("returns 0 to fit segments of 15 long into ((10,10), (0,0))", function(){
            expect(
                geo.getNumberOfSegments(
                    {xFrom:10, yFrom:10, xTo:0, yTo:0},
                    15
                )
            ).equal(0);
        });
        it("returns 5 to fit segments of 2 long into ((10,-10), (10,0))", function(){
            expect(
                geo.getNumberOfSegments(
                    {xFrom:10, yFrom:-10, xTo:10, yTo:0},
                    2
                )
            ).equal(5);
        });
        it("returns 0 to for a line of 0 length", function(){
            expect(
                geo.getNumberOfSegments(
                    {xFrom:10, yFrom:-10, xTo:10, yTo:-10},
                    1
                )
            ).equal(0);
        });
    });


    describe('#getBetweenPoints', function () {

        describe("a diagonal", function(){
            var lBetweenPoints = [];

            before(function(){
                lBetweenPoints =
                    geo.getBetweenPoints(
                        {xFrom:10, yFrom:0, xTo:0, yTo:10},
                        3,
                        0
                    );
            });

            it("returns an array of 4 points", function(){
                expect(lBetweenPoints.length).to.equal(4);
            });

            it("returns the endpoint of the line as the last point", function(){
                expect(
                    lBetweenPoints.map(function(pPoint){
                        return {
                            x: pPoint.x,
                            y: pPoint.y
                        };
                    })[lBetweenPoints.length - 1]
                ).to.deep.equal({x:0, y:10});
            });

            it("returns points along the line", function(){
                expect(lBetweenPoints).to.deep.equal([
                    {
                        "controlX": 8.94,
                        "controlY": 1.06,
                        "x": 7.88,
                        "y": 2.12
                    },
                    {
                        "controlX": 6.82,
                        "controlY": 3.18,
                        "x": 5.76,
                        "y": 4.24
                    },
                    {
                        "controlX": 4.7,
                        "controlY": 5.3,
                        "x": 3.64,
                        "y": 6.36
                    },
                    {
                        "controlX": 2.58,
                        "controlY": 7.42,
                        "x": 0,
                        "y": 10
                    }
                ]);
            });
        });

        describe("a vertical line", function(){
            var lBetweenPoints = [];

            before(function(){
                lBetweenPoints =
                    geo.getBetweenPoints(
                        {xFrom:10, yFrom:0, xTo:10, yTo:10},
                        3,
                        0
                    );
            });

            it("returns an array of 3 points", function(){
                expect(lBetweenPoints.length).to.equal(3);
            });

            it("returns the endpoint of the line as the last point", function(){
                expect(
                    lBetweenPoints.map(function(pPoint){
                        return {
                            x: pPoint.x,
                            y: pPoint.y
                        };
                    })[lBetweenPoints.length - 1]
                ).to.deep.equal({x:10, y:10});
            });

            it("returns points along the line", function(){
                expect(lBetweenPoints).to.deep.equal([
                    {
                        "controlX": 10,
                        "controlY": 1.5,
                        "x": 10,
                        "y": 3
                    },
                    {
                        "controlX": 10,
                        "controlY": 4.5,
                        "x": 10,
                        "y": 6
                    },
                    {
                        "controlX": 10,
                        "controlY": 7.5,
                        "x": 10,
                        "y": 10
                    }
                ]);
            });
        });

        describe("a horizontal line", function(){
            var lBetweenPoints = [];

            before(function(){
                lBetweenPoints =
                    geo.getBetweenPoints(
                        {xFrom:10, yFrom:20, xTo:20, yTo:20},
                        3,
                        0
                    );
            });

            it("returns an array of 3 points", function(){
                expect(lBetweenPoints.length).to.equal(3);
            });

            it("returns the endpoint of the line as the last point", function(){
                expect(
                    lBetweenPoints.map(function(pPoint){
                        return {
                            x: pPoint.x,
                            y: pPoint.y
                        };
                    })[lBetweenPoints.length - 1]
                ).to.deep.equal({x:20, y:20});
            });

            it("returns points along the line", function(){
                expect(lBetweenPoints).to.deep.equal([
                    {
                        "controlX": 11.5,
                        "controlY": 20,
                        "x": 13,
                        "y": 20
                    },
                    {
                        "controlX": 14.5,
                        "controlY": 20,
                        "x": 16,
                        "y": 20
                    },
                    {
                        "controlX": 17.5,
                        "controlY": 20,
                        "x": 20,
                        "y": 20
                    }
                ]);
            });
        });

        describe("errors", function(){
            it("throws an error for intervals of length === 0", function(){
                try {
                    geo.getBetweenPoints(
                        {xFrom:10, yFrom:0, xTo:0, yTo:10},
                        0,
                        0
                    );
                    expect("won't come here because it should throw an error").to.equal("did come here nonetheless");
                } catch (e) {
                    expect(e.toString()).to.equal("Error: pInterval must be > 0");
                }
            });

            it("throws an error for intervals of length < 0", function(){
                try {
                    geo.getBetweenPoints(
                        {xFrom:10, yFrom:0, xTo:0, yTo:10},
                        -42,
                        0
                    );
                    expect("won't come here because it should throw an error").to.equal("did come here nonetheless");
                } catch (e) {
                    expect(e.toString()).to.equal("Error: pInterval must be > 0");
                }
            });
        });

    });

});
