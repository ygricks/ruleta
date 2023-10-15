import { FigureCord, FigureProfile, TextStyle } from '../../figure';

export function textMiddleAlign(
    profile: FigureProfile,
    text: TextStyle,
    descent: boolean = false
): FigureCord {
    const { x: fx, y: fy, w: fw, h: fh } = profile;
    const x = fx + fw / 2 - (text.size / 3.3) * text.text.length;
    let y: number;
    if (descent) {
        y = this.fy + this.h / 2 + text.size / 3.9;
    } else {
        y = fy + fh / 2 + text.size / 3;
    }
    return { x, y };
}
