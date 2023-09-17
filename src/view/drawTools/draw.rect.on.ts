import { ICanvas } from '../../viewport/interfaces/icanvas';
import { FigureProfile } from '../../figure';
import { Color } from '../../color';

export function drawRectOn(
    onBoard: ICanvas,
    profile: FigureProfile,
    bg: Color,
    lh: number = 2
): void {
    const { ctx } = onBoard;
    const { x, y, w, h } = profile;

    ctx.beginPath();
    ctx.strokeStyle = Color.FULLBLACK;
    ctx.lineWidth = lh;
    ctx.strokeRect(x, y, w, h);
    ctx.stroke();
    ctx.rect(x, y, w, h);
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.closePath();
}
