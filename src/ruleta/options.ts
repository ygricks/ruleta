import { Color } from '../color';
import { RectOption } from '../rect';

type Option = {
    n: string;
    x: number;
    y: number;
    w: number;
    h: number;
    o: RectOption;
    b?: Color;
};

export const Options: Option[] = [
    {
        n: '1st12',
        o: RectOption._1ST12,
        x: 1,
        y: 3,
        w: 4,
        h: 0.8
    },
    {
        n: '2st12',
        o: RectOption._2ST12,
        x: 5,
        y: 3,
        w: 4,
        h: 0.8
    },
    {
        n: '3st12',
        o: RectOption._3ST12,
        x: 9,
        y: 3,
        w: 4,
        h: 0.8
    },
    {
        n: '1-18',
        o: RectOption._1TO18,
        x: 1,
        y: 3.8,
        w: 6,
        h: 0.8
    },
    {
        n: '19-36',
        o: RectOption._19TO36,
        x: 7,
        y: 3.8,
        w: 6,
        h: 0.8
    },
    {
        n: '2to1',
        o: RectOption._1_LINE,
        x: 13,
        y: 0,
        w: 2,
        h: 1
    },
    {
        n: '2to1',
        o: RectOption._2_LINE,
        x: 13,
        y: 1,
        w: 2,
        h: 1
    },
    {
        n: '2to1',
        o: RectOption._3_LINE,
        x: 13,
        y: 2,
        w: 2,
        h: 1
    },
    {
        n: 'Even',
        o: RectOption.EVEN,
        x: 1,
        y: 4.6,
        w: 3,
        h: 0.8
    },
    {
        n: 'Odd',
        o: RectOption.ODD,
        x: 4,
        y: 4.6,
        w: 3,
        h: 0.8
    },
    {
        n: 'Red',
        o: RectOption.RED,
        x: 7,
        y: 4.6,
        w: 3,
        h: 0.8,
        b: Color.RED
    },
    {
        n: 'Black',
        o: RectOption.BLACK,
        x: 10,
        y: 4.6,
        w: 3,
        h: 0.8,
        b: Color.BLACK
    },
    {
        n: 'ROLL',
        o: RectOption.ROLL,
        x: 1,
        y: 6,
        w: 3,
        h: 1,
        b: Color.ORANGE
    }
];
