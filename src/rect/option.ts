export enum RectOptionBid {
    _1ST12 = '1st12',
    _2ST12 = '2st12',
    _3ST12 = '3st12',
    _1TO18 = '1>18',
    _19TO36 = '19>36',
    _1_LINE = '1_line',
    _2_LINE = '2_line',
    _3_LINE = '3_line',
    EVEN = 'even',
    ODD = 'odd',
    RED = 'red',
    BLACK = 'black',
    CELL = 'cell'
}

export enum RectOptionOther {
    ROLL = 'roll',
    CONT = 'cont',
    BUTTON = 'button'
}

export const RectOption = {
    ...RectOptionBid,
    ...RectOptionOther
};

export type RectOption = RectOptionBid | RectOptionOther;
