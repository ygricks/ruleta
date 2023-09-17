import { Color } from '../../color';
import { FigureProfile } from '../../figure';
import { ICanvas } from '../../viewport';

export function drawRectBorder(
    onBoard: ICanvas,
    profile: FigureProfile,
    c: Color,
    lh: number = 2
) {
    const { ctx } = onBoard;
    const { x, y, w, h } = profile;

    ctx.beginPath();
    ctx.strokeStyle = c;
    ctx.lineWidth = lh;
    ctx.strokeRect(x, y, w, h);
    ctx.fill();
    ctx.stroke();
}
