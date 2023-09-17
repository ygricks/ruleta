import { Shape } from '../figure';
import { ICanvas, ISize } from './interfaces';

export class ViewPort {
    public readonly board: ICanvas;
    public readonly ui: ICanvas;
    public readonly out: ICanvas;
    public readonly size: ISize;
    constructor(shape: Shape) {
        const body = document.querySelector('body');
        let out = 4; // remove on full screen
        this.size = {
            width: body.offsetWidth - out,
            height: body.offsetHeight - out
        };
        if (shape.w > this.size.width) {
            this.size.width = shape.w;
        }
        if (shape.h > this.size.height) {
            this.size.height = shape.h;
        }

        this.board = this.newCanvas('board');
        this.ui = this.newCanvas('ui');
        this.out = this.newCanvas('out');

        body.appendChild(this.out.canvas);
    }
    newCanvas(id: string): ICanvas {
        const canvas = document.createElement('canvas');
        const { width, height } = this.size;
        canvas.width = width;
        canvas.height = height;
        canvas.setAttribute('id', id);
        const ctx = canvas.getContext('2d');
        const clear = (function (ctx, w, h) {
            return function () {
                ctx.clearRect(0, 0, w, h);
            };
        })(ctx, width, height);
        return { canvas, ctx, clear };
    }
    view() {
        this.out.clear();
        const {
            board: { canvas: source1 },
            ui: { canvas: source2 },
            out: { ctx }
        } = this;
        ctx.drawImage(source1, 0, 0, this.size.width, this.size.height);
        ctx.drawImage(source2, 0, 0, this.size.width, this.size.height);
    }
}
