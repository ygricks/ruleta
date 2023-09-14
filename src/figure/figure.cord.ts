import { Shape } from './profile';

export type FigureCord = {
    x: number;
    y: number;
};

export function CordMultiply(cord: Shape, multiply: FigureCord): FigureCord {
    return {
        x: cord.w * multiply.x,
        y: cord.h * multiply.y
    };
}
