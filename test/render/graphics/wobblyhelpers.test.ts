import { describe, it, before } from "node:test";
import { deepEqual } from "node:assert/strict";
import {
  getLineLength,
  getNumberOfSegments,
  getBetweenPoints,
} from "../../../src/render/graphics/svgelementfactory/wobbly/helpers";
import type { ICurveSection } from "../../../src/render/graphics/svgelementfactory/geotypes";

describe("#geometry", () => {
  describe("#getLineLength", () => {
    it("returns 10 for (10,0), (10,10)", () => {
      deepEqual(getLineLength({ xFrom: 10, yFrom: 0, xTo: 10, yTo: 10 }), 10);
    });
    it("returns 10 for (0,10), (10,10)", () => {
      deepEqual(getLineLength({ xFrom: 0, yFrom: 10, xTo: 10, yTo: 10 }), 10);
    });
    it("returns ~14.1 for (10,0), (0,10)", () => {
      deepEqual(
        getLineLength({ xFrom: 10, yFrom: 0, xTo: 0, yTo: 10 }),
        14.142135623730951,
      );
    });
    it("returns 0 for (10,0), (0,10)", () => {
      deepEqual(getLineLength({ xFrom: 10, yFrom: -10, xTo: 10, yTo: -10 }), 0);
    });
  });

  describe("#getNumberOfSegments", () => {
    it("returns 1 to fit segments of 10 long into ((10,0), (0,10))", () => {
      deepEqual(
        getNumberOfSegments({ xFrom: 10, yFrom: 0, xTo: 0, yTo: 10 }, 10),
        1,
      );
    });
    it("returns 14 to fit segments of 1 long into ((10,0), (0,10))", () => {
      deepEqual(
        getNumberOfSegments({ xFrom: 10, yFrom: 0, xTo: 0, yTo: 10 }, 1),
        14,
      );
    });
    it("returns 14 to fit segments of 1 long into ((10,10), (0,0))", () => {
      deepEqual(
        getNumberOfSegments({ xFrom: 10, yFrom: 10, xTo: 0, yTo: 0 }, 1),
        14,
      );
    });
    it("returns 0 to fit segments of 15 long into ((10,10), (0,0))", () => {
      deepEqual(
        getNumberOfSegments({ xFrom: 10, yFrom: 10, xTo: 0, yTo: 0 }, 15),
        0,
      );
    });
    it("returns 5 to fit segments of 2 long into ((10,-10), (10,0))", () => {
      deepEqual(
        getNumberOfSegments({ xFrom: 10, yFrom: -10, xTo: 10, yTo: 0 }, 2),
        5,
      );
    });
    it("returns 0 to for a line of 0 length", () => {
      deepEqual(
        getNumberOfSegments({ xFrom: 10, yFrom: -10, xTo: 10, yTo: -10 }, 1),
        0,
      );
    });
  });

  describe("#getBetweenPoints", () => {
    describe("a diagonal", () => {
      let lBetweenPoints = [] as ICurveSection[];

      before(() => {
        lBetweenPoints = getBetweenPoints(
          { xFrom: 10, yFrom: 0, xTo: 0, yTo: 10 },
          3,
          0,
        );
      });

      it("returns an array of 4 points", () => {
        deepEqual(lBetweenPoints.length, 4);
      });

      it("returns the endpoint of the line as the last point", () => {
        deepEqual(
          lBetweenPoints.map((pPoint) => ({
            x: pPoint.x,
            y: pPoint.y,
          }))[lBetweenPoints.length - 1],
          { x: 0, y: 10 },
        );
      });

      it("returns points along the line", () => {
        deepEqual(lBetweenPoints, [
          {
            controlX: 8.94,
            controlY: 1.06,
            x: 7.88,
            y: 2.12,
          },
          {
            controlX: 6.82,
            controlY: 3.18,
            x: 5.76,
            y: 4.24,
          },
          {
            controlX: 4.7,
            controlY: 5.3,
            x: 3.64,
            y: 6.36,
          },
          {
            controlX: 2.58,
            controlY: 7.42,
            x: 0,
            y: 10,
          },
        ]);
      });
    });

    describe("a vertical line", () => {
      let lBetweenPoints = [] as ICurveSection[];

      before(() => {
        lBetweenPoints = getBetweenPoints(
          { xFrom: 10, yFrom: 0, xTo: 10, yTo: 10 },
          3,
          0,
        );
      });

      it("returns an array of 3 points", () => {
        deepEqual(lBetweenPoints.length, 3);
      });

      it("returns the endpoint of the line as the last point", () => {
        deepEqual(
          lBetweenPoints.map((pPoint) => ({
            x: pPoint.x,
            y: pPoint.y,
          }))[lBetweenPoints.length - 1],
          { x: 10, y: 10 },
        );
      });

      it("returns points along the line", () => {
        deepEqual(lBetweenPoints, [
          {
            controlX: 10,
            controlY: 1.5,
            x: 10,
            y: 3,
          },
          {
            controlX: 10,
            controlY: 4.5,
            x: 10,
            y: 6,
          },
          {
            controlX: 10,
            controlY: 7.5,
            x: 10,
            y: 10,
          },
        ]);
      });
    });

    describe("a horizontal line", () => {
      let lBetweenPoints = [] as ICurveSection[];

      before(() => {
        lBetweenPoints = getBetweenPoints(
          { xFrom: 10, yFrom: 20, xTo: 20, yTo: 20 },
          3,
          0,
        );
      });

      it("returns an array of 3 points", () => {
        deepEqual(lBetweenPoints.length, 3);
      });

      it("returns the endpoint of the line as the last point", () => {
        deepEqual(
          lBetweenPoints.map((pPoint) => ({
            x: pPoint.x,
            y: pPoint.y,
          }))[lBetweenPoints.length - 1],
          { x: 20, y: 20 },
        );
      });

      it("returns points along the line", () => {
        deepEqual(lBetweenPoints, [
          {
            controlX: 11.5,
            controlY: 20,
            x: 13,
            y: 20,
          },
          {
            controlX: 14.5,
            controlY: 20,
            x: 16,
            y: 20,
          },
          {
            controlX: 17.5,
            controlY: 20,
            x: 20,
            y: 20,
          },
        ]);
      });
    });

    describe("errors", () => {
      it("throws an error for intervals of length === 0", () => {
        try {
          getBetweenPoints({ xFrom: 10, yFrom: 0, xTo: 0, yTo: 10 }, 0, 0);
          deepEqual(
            "won't come here because it should throw an error",
            "did come here nonetheless",
          );
        } catch (e: any) {
          deepEqual(e.toString(), "Error: pInterval must be > 0");
        }
      });

      it("throws an error for intervals of length < 0", () => {
        try {
          getBetweenPoints({ xFrom: 10, yFrom: 0, xTo: 0, yTo: 10 }, -42, 0);
          deepEqual(
            "won't come here because it should throw an error",
            "did come here nonetheless",
          );
        } catch (e: any) {
          deepEqual(e.toString(), "Error: pInterval must be > 0");
        }
      });
    });
  });
});
