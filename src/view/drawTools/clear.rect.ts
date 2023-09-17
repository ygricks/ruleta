import { ICanvas } from '../../viewport/interfaces/icanvas';
import { FigureProfile } from '../../figure';

export function clearRect(onBoard: ICanvas, profile: FigureProfile): void {
    const { ctx } = onBoard;
    const { x, y, w, h } = profile;

    ctx.clearRect(x, y, w, h);
}
