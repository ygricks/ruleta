import { FigureCell } from './figure.cell';
import { FigureOption } from './figure.option';
import { FigureSpecial } from './figure.special';
import { FigureBidAmount } from './figure.bid.amount';

// common Figure
export const Figure = {
    ...FigureCell,
    ...FigureOption,
    ...FigureSpecial,
    ...FigureBidAmount
};

// common Figure type
export type Figure =
    | FigureCell
    | FigureOption
    | FigureSpecial
    | FigureBidAmount;
