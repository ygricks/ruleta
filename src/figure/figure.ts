import { FigureCell } from './figure.cell';
import { FigureOption } from './figure.option';
import { FigureSpecial } from './figure.special';

// common Figure
export const Figure = {
    ...FigureCell,
    ...FigureOption,
    ...FigureSpecial
};

// common Figure type
export type Figure = FigureCell | FigureOption | FigureSpecial;
