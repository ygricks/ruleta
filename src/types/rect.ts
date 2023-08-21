import { Color } from '../config';
import { Canvas } from './viewport';
export type RectStyle = Partial<{
    borderWidth: number,
    borderColor: string,
    background: string,
}>;

export enum RectType {
    CELL = 'cell',
    OPTION = 'option',
    ROLL = 'roll',
    CONT = 'cont',
}

export enum RectOption {
    '1st12' = '1st12',
    '2st12' = '2st12',
    '3st12' = '3st12',
    '1>18' = '1>18',
    '19>36' = '19>36',
    '1_line' = '1_line',
    '2_line' = '2_line',
    '3_line' = '3_line',
    'even' = 'even',
    'odd' = 'odd',
    'red' = 'red',
    'black' = 'black',
    'cell' = 'cell',
}

export interface RectParam {
    name: string,
    type: RectType,
    option: RectOption,
    background?: Color,
    borderColor?: Color,
    borderWidth?: number,
}

export class SRect {
    constructor(
        public readonly x: number,
        public readonly y: number,
        public readonly w: number,
        public readonly h: number,
        public readonly param: RectParam
    ) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.param = param;
    }
}



export class Rect {
    // public name?: string;
    public style?: RectStyle;
    // public type?: RectType;
    public constructor(
        public readonly name: string,
        public readonly type: RectType,
        public readonly x: number,
        public readonly y: number,
        public readonly w: number,
        public readonly h: number,
    ) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    setStyle(style:RectStyle) {
        const keys = Object.keys(style);
        if (!this.style) {this.style={};}
        if (keys.includes('background')) {this.style.background = style.background;}
        if (keys.includes('borderColor')) {this.style.borderColor = style.borderColor;}
        if (keys.includes('borderWidth')) {this.style.borderWidth = style.borderWidth;}
        return this;
    }
    clone():Rect {
        const rect = new Rect(this.name, this.type, this.x,this.y,this.w,this.h);
        rect.setStyle(this.style);
        return rect;
    }
    drawRectOn(board: Canvas):Rect {
        const { ctx } = board;
        const { x, y, w, h, style } = this;
        ctx.beginPath();
        if(style && style.borderWidth && style.borderWidth > 0) {
            ctx.strokeStyle = style.borderColor;
            ctx.lineWidth = style.borderWidth;
            ctx.strokeRect(x, y, w, h);
            ctx.stroke();
        }
        if(style.background) {
            ctx.rect(x, y, w, h);
            ctx.fillStyle = style.background;
            ctx.fill();
        }
        ctx.closePath();
        return this;
    }
    drawTextOn(board: Canvas, fontSize:number = 36):Rect {
        const { ctx } = board;
        const x = this.x + this.w/2 - fontSize/3.3 * this.name.length;

        // with descent
        // const y = this.y + this.h/2 + fontSize/3.9;

        // without descent
        const y = this.y + this.h/2 + fontSize/3;

        ctx.beginPath();
        ctx.font = `${fontSize}px Courier New`;
        ctx.fillStyle = 'white';
        ctx.fillText(this.name, x, y);
        ctx.closePath();
        ctx.fill();
        return this;
    }
        
}