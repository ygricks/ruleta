import { Color } from '../../color';
import { FigureProfile } from '../../figure';
import { ICanvas } from '../../viewport';

export function drawRectBorder(
    onBoard: ICanvas,
    profile: FigureProfile,
    c: Color,
    lh: number = 2
) {
    const half = lh / 2;
    const { ctx } = onBoard;
    let { x, y, w, h } = profile;

    const margin: string = 'out';

    if (margin === 'out') {
        x = x - half;
        y = y - half;
        w = w + lh - 1;
        h = h + lh;
    } else if (margin === 'in') {
        x = x + half;
        y = y + half;
        w = w - lh - 1;
        h = h - lh - 1;
    }

    ctx.beginPath();
    ctx.strokeStyle = c;
    ctx.lineWidth = lh;
    ctx.strokeRect(x, y, w, h);
    ctx.fill();
    ctx.stroke();
}
