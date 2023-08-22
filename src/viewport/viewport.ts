import { ICanvas, ISize } from "./interfaces";

export class ViewPort {
    public readonly board: ICanvas;
    public readonly ui: ICanvas;
    public readonly size: ISize;
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
    newCanvas(id:string): ICanvas {
        const canvas = document.createElement('canvas');
        canvas.width = this.size.width;
        canvas.height = this.size.height;
        canvas.setAttribute('id', id);
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, this.size.width, this.size.height);
        return { canvas, ctx };
    }
    copy() {
        const {board:{canvas:source}, ui:{ctx}} = this;
        ctx.drawImage(source, 0, 0, this.size.width, this.size.height);
    }
}
