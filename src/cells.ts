import { Color } from "./color";


interface Cell {
    n:number;
    x:number;
    y:number;
    color: Color;
} 

export const Cells: {[key: number]: Cell} = {
    0: { n: 0, x: 5, y: 5, color: Color.GREEN },
    1: { n: 1, x: 2, y: 1, color: Color.RED },
    2: { n: 2, x: 1, y: 1, color: Color.BLACK },
    3: { n: 3, x: 0, y: 1, color: Color.RED },
    4: { n: 4, x: 2, y: 2, color: Color.BLACK },
    5: { n: 5, x: 1, y: 2, color: Color.RED },
    6: { n: 6, x: 0, y: 2, color: Color.BLACK },
    7: { n: 7, x: 2, y: 3, color: Color.RED },
    8: { n: 8, x: 1, y: 3, color: Color.BLACK },
    9: { n: 9, x: 0, y: 3, color: Color.RED },
    10: { n: 10, x: 2, y: 4, color: Color.BLACK },
    11: { n: 11, x: 1, y: 4, color: Color.BLACK },
    12: { n: 12, x: 0, y: 4, color: Color.RED },
    13: { n: 13, x: 2, y: 5, color: Color.BLACK },
    14: { n: 14, x: 1, y: 5, color: Color.RED },
    15: { n: 15, x: 0, y: 5, color: Color.BLACK },
    16: { n: 16, x: 2, y: 6, color: Color.RED },
    17: { n: 17, x: 1, y: 6, color: Color.BLACK },
    18: { n: 18, x: 0, y: 6, color: Color.RED },
    19: { n: 19, x: 2, y: 7, color: Color.RED },
    20: { n: 20, x: 1, y: 7, color: Color.BLACK },
    21: { n: 21, x: 0, y: 7, color: Color.RED },
    22: { n: 22, x: 2, y: 8, color: Color.BLACK },
    23: { n: 23, x: 1, y: 8, color: Color.RED },
    24: { n: 24, x: 0, y: 8, color: Color.BLACK },
    25: { n: 25, x: 2, y: 9, color: Color.RED },
    26: { n: 26, x: 1, y: 9, color: Color.BLACK },
    27: { n: 27, x: 0, y: 9, color: Color.RED },
    28: { n: 28, x: 2, y: 10, color: Color.BLACK },
    29: { n: 29, x: 1, y: 10, color: Color.BLACK },
    30: { n: 30, x: 0, y: 10, color: Color.RED },
    31: { n: 31, x: 2, y: 11, color: Color.BLACK },
    32: { n: 32, x: 1, y: 11, color: Color.RED },
    33: { n: 33, x: 0, y: 11, color: Color.BLACK },
    34: { n: 34, x: 2, y: 12, color: Color.RED },
    35: { n: 35, x: 1, y: 12, color: Color.BLACK },
    36: { n: 36, x: 0, y: 12, color: Color.RED },
};
