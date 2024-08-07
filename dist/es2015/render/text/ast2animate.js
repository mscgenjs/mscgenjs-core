const EMPTY_ARC = [{ kind: "|||" }];
const EMPTY_AST = {
	entities: [],
	meta: {
		extendedArcTypes: false,
		extendedFeatures: false,
		extendedOptions: false,
	},
};
export class FrameFactory {
	constructor(pAST, pPreCalculate) {
		this.AST = EMPTY_AST;
		this.arcs = [[]];
		this.len = 0;
		this.noRows = 0;
		this.position = 0;
		this.frames = [];
		this.preCalculate = false;
		if (pAST) {
			if (pAST && typeof pPreCalculate !== "undefined") {
				this.init(pAST, pPreCalculate);
			} else {
				this.init(pAST);
			}
		}
	}
	/*
	 * initializes the frame generator with an AST and
	 * calculates the number of frames in it.
	 *
	 * @param pAST - abstract syntax tree to calculate
	 * @param pPreCalculate - if true the module will pre-calculate all frames
	 *                 in advance. In all other cases the module will
	 *                 calculate each frame when it is called for (with
	 *                 getFrame/ getCurrentFrame calls). Note that the
	 *                 latter usually is fast enough(tm) even for real
	 *                 time rendering. It will probably save you some
	 *                 cpu cycles when you're going traverse the frames
	 *                 a lot, at the expense of memory usage.
	 *
	 *                 Paramater might get removed somewhere in the near
	 *                 future.
	 */
	init(pAST, pPreCalculate) {
		this.preCalculate = pPreCalculate ? true === pPreCalculate : false;
		this.AST = structuredClone(pAST);
		this.len = this._calculateLength(pAST);
		this.noRows = this._calcNumberOfRows(pAST);
		this.position = 0;
		if (this.AST.arcs) {
			this.arcs = structuredClone(this.AST.arcs);
			this.AST.arcs = [];
		}
		this.frames = [];
		if (this.preCalculate) {
			for (let i = 0; i < this.len; i++) {
				this.frames.push(structuredClone(this._calculateFrame(i)));
			}
		}
	}
	/*
	 * Set position to the provided frame number
	 * If pFrameNumber > last frame, sets position to last frame
	 * If pFrameNumber < first frame, sets position to first frame
	 */
	setPosition(pPosition) {
		this.position = Math.min(this.len, Math.max(0, pPosition));
	}
	/*
	 * Go to the first frame
	 */
	home() {
		this.position = 0;
	}
	/*
	 * Skips pFrames ahead. When pFrames not provided, skips 1 ahead
	 *
	 * won't go beyond the last frame
	 */
	inc(pFrames = 1) {
		this.setPosition(this.position + pFrames);
	}
	/*
	 * Skips pFrames back. When pFrames not provided, skips 1 back
	 *
	 * won't go before the first frame
	 */
	dec(pFrames = 1) {
		this.setPosition(this.position - pFrames);
	}
	/*
	 * Go to the last frame
	 */
	end() {
		this.position = this.len;
	}
	/*
	 * returns the current frame
	 */
	getCurrentFrame() {
		return this.getFrame(this.position);
	}
	/*
	 * returns frame pFrameNo
	 * if pFrameNo >= getLength() - returns the last frame (=== original AST)
	 * if pFrameNo <= 0 - returns the first frame (=== original AST - arcs)
	 */
	getFrame(pFrameNo) {
		pFrameNo = Math.max(0, Math.min(pFrameNo, this.len - 1));
		if (this.preCalculate) {
			return this.frames[pFrameNo];
		} else {
			return this._calculateFrame(pFrameNo);
		}
	}
	/*
	 * returns the position of the current frame (number)
	 */
	getPosition() {
		return this.position;
	}
	/*
	 * returns the number of "frames" in this AST
	 */
	getLength() {
		return this.len;
	}
	/*
	 * returns the ratio position/ length in percents.
	 * 0 <= result <= 100, even when position actually exceeds
	 * length or is below 0
	 */
	getPercentage() {
		return this.len > 0 && this.position > 0
			? 100 * Math.min(1, this.position / this.len)
			: 0;
	}
	/*
	 * returns the number of rows for the current AST
	 */
	getNoRows() {
		return this.noRows;
	}
	_drawArcsUntilRow(pFrameNo) {
		let lFrameCount = 0;
		let lRowNo = 0;
		if (this.AST.arcs) {
			while (lFrameCount < pFrameNo) {
				this.AST.arcs[lRowNo] = [];
				for (
					let j = 0;
					j < this.arcs[lRowNo].length && lFrameCount++ < pFrameNo;
					j++
				) {
					this.AST.arcs[lRowNo].push(this.arcs[lRowNo][j]);
				}
				lRowNo++;
			}
		}
		return lRowNo;
	}
	_fillDownWithEmptyArcs(pRowNoFrom) {
		if (this.AST.arcs) {
			for (let k = pRowNoFrom; k < this.noRows; k++) {
				this.AST.arcs[k] = EMPTY_ARC;
			}
		}
	}
	/*
	 * Returns the AST the subset frame pFrameNo should constitute
	 */
	_calculateFrame(pFrameNo) {
		pFrameNo = Math.min(pFrameNo, this.len - 1);
		if (this.len - 1 > 0) {
			this.AST.arcs = [];
		}
		const lRowNo = this._drawArcsUntilRow(pFrameNo);
		this._fillDownWithEmptyArcs(lRowNo);
		return this.AST;
	}
	/*
	 * calculates the number of "frames" in the current AST
	 * --> does not yet cater for recursive structures
	 */
	_calculateLength(pThing) {
		let lRetval = 1; /* separate frame for entities */
		if (pThing.arcs) {
			lRetval = pThing.arcs.reduce(
				(pSum, pArcRow) =>
					pSum +
					(Boolean(pArcRow[0].arcs)
						? this._calculateLength(pArcRow[0])
						: pArcRow.length),
				lRetval,
			);
		}
		return lRetval;
	}
	/*
	 * returns the number of rows for a given AST (/ AST snippet)
	 */
	_calcNumberOfRows(pThing) {
		let lRetval = 0;
		if (pThing.arcs) {
			lRetval = pThing.arcs.reduce(
				(pSum, pArcRow) =>
					pSum +
					(Boolean(pArcRow[0].arcs)
						? this._calcNumberOfRows(pArcRow[0]) + 2
						: 1),
				lRetval,
			);
		}
		return lRetval;
	}
}
