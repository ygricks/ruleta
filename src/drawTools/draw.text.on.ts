import { ICanvas } from '../viewport/interfaces/icanvas';
import { TextStyle } from '../figure';

export function drawTextOn(
    onBoard: ICanvas,
    fx: number,
    fy: number,
    fw: number,
    fh: number,
    text: TextStyle
): void {
    const { ctx } = onBoard;
    const x = fx + fw / 2 - (text.size / 3.3) * text.text.length;

    // with descent
    // const y = this.fy + this.h/2 + text.size/3.9;

    // without descent
    const y = fy + fh / 2 + text.size / 3;

    ctx.beginPath();
    ctx.font = `${text.size}px Courier New`;
    ctx.fillStyle = 'white';
    ctx.fillText(text.text, x, y);
    ctx.closePath();
    ctx.fill();
}
