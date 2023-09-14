import { Color } from '../color';
import { Figure } from './figure';
import { FigureCell } from './figure.cell';
import { FigureKeys } from './figure.keys';
import { FigureOption } from './figure.option';
import { FigureSpecial } from './figure.special';

export function GetColor(figure: Figure): Color {
    if (FigureCell.hasOwnProperty(FigureKeys[figure])) {
        const n = parseInt(figure);
        const firstRed = n < 11 || (n > 18 && n < 29);
        const even = n % 2 == 0;
        const color =
            n == 0
                ? Color.GREEN
                : firstRed
                ? even
                    ? Color.BLACK
                    : Color.RED
                : even
                ? Color.RED
                : Color.BLACK;
        return color;
    }
    if (FigureOption.hasOwnProperty(FigureKeys[figure])) {
        switch (figure) {
            case Figure.RED:
                return Color.RED;
            case Figure.BLACK:
                return Color.BLACK;
            default:
                return Color.GREEN;
        }
    }
    if (FigureSpecial.hasOwnProperty(FigureKeys[figure])) {
        if (figure === Figure.ROLL) {
            return Color.ORANGE;
        }
        return Color.GREEN;
    }
    return Color.YELLOW;
}
