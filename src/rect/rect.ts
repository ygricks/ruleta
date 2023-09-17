import { IParam } from '.';
import { drawTextOn } from '../view/drawTools';
import { ICanvas } from '../viewport';

export class Rect {
    constructor(
        public readonly x: number,
        public readonly y: number,
        public readonly w: number,
        public readonly h: number,
        public readonly param: IParam
    ) {}
    clone(withParam?: Partial<IParam>): Rect {
        const params: IParam = Object.assign({}, this.param);
        const keys = Object.keys(withParam);
        // rewrite only styles at first, all @TODO
        if (keys.includes('background')) {
            params.background = withParam.background;
        }
        if (keys.includes('borderColor')) {
            params.borderColor = withParam.borderColor;
        }
        if (keys.includes('borderWidth')) {
            params.borderWidth = withParam.borderWidth;
        }
        return new Rect(this.x, this.y, this.w, this.h, params);
    }
    private getBoard(onBoard: ICanvas): ICanvas {
        const { board } = this.param;
        if (onBoard) {
            return onBoard;
        }
        if (board) {
            return board;
        }
        throw new Error(`No active board on rect name: "${this.param.name}"`);
    }
    drawRect(onBoard?: ICanvas): Rect {
        const { background, borderColor, borderWidth } = this.param;
        const { ctx } = this.getBoard(onBoard);
        const { x, y, w, h } = this;

        ctx.beginPath();
        if (borderWidth && borderWidth > 0) {
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = borderWidth;
            ctx.strokeRect(x, y, w, h);
            ctx.stroke();
        }
        if (background) {
            ctx.rect(x, y, w, h);
            ctx.fillStyle = background;
            ctx.fill();
        }
        ctx.closePath();
        return this;
    }
    drawText(onBoard?: ICanvas): Rect {
        let { fontSize } = this.param;
        if (!fontSize) {
            fontSize = 36;
        }
        const board = this.getBoard(onBoard);
        drawTextOn(board, this.x, this.y, this.w, this.h, {
            text: this.param.name,
            size: fontSize
        });
        return this;
    }
    draw(onBoard?: ICanvas): Rect {
        const board = this.getBoard(onBoard);
        this.drawRect(board);
        this.drawText(board);
        return this;
    }
}
