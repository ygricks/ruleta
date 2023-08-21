export interface Size {
    width: number;
    height: number;
}

export class Canvas {
    public readonly canvas: HTMLCanvasElement;
    public readonly ctx: CanvasRenderingContext2D;
    constructor(canvas: HTMLCanvasElement, size:Size, id: string) {
        this.canvas = canvas;
        this.canvas.width = size.width;
        this.canvas.height = size.height;
        this.canvas.setAttribute('id', id);
        this.ctx = this.canvas.getContext("2d");
        this.ctx.clearRect(0, 0, size.width, size.height);
    }
}

export class ViewPort {
    public readonly board: Canvas;
    public readonly ui: Canvas;
    public readonly size: Size;
    constructor() {
        const body = document.querySelector('body');
        this.size = {
            width: body.offsetWidth - 4,
            height: body.offsetHeight - 4
        };
        this.board = this.newCanvas('board');        
        this.ui = this.newCanvas('ui');
        body.appendChild(this.ui.canvas);
    }
    newCanvas(id:string) {
        return new Canvas(document.createElement('canvas'), this.size, id);
    }
    copy() {
        const {board:{canvas:source}, ui:{ctx}} = this;
        ctx.drawImage(source, 0, 0, this.size.width, this.size.height);
    }
}
