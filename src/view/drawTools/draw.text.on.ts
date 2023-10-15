import { ICanvas } from '../../viewport/interfaces/icanvas';
import { FigureProfile, TextStyle } from '../../figure';
import { textMiddleAlign } from './draw.text.middle';

export function drawTextOn(
    onBoard: ICanvas,
    profile: FigureProfile,
    text: TextStyle
): void {
    const { ctx } = onBoard;
    const { x, y } = textMiddleAlign(profile, text);
    ctx.beginPath();
    ctx.font = `${text.size}px Courier New`;
    ctx.fillStyle = 'white';
    ctx.fillText(text.text, x, y);
    ctx.closePath();
    ctx.fill();
}
