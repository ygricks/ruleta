import { Figure } from './figure';
import { CordMultiply } from './figure.cord';
import { Profile, Shape } from './profile';

// common horizontal shape
const size: Shape = { w: 66, h: 60 };
const line12: Shape = { w: size.w * 2, h: size.h };
const line3: Shape = { w: size.w * 3, h: size.h * 0.8 };
const line4: Shape = { w: size.w * 4, h: size.h * 0.8 };
const line6: Shape = { w: size.w * 6, h: size.h * 0.8 };
const bidSize: Shape = { w: size.w * 0.8, h: size.h * 0.8 };

// cell profile for horizontal view
export const HorizontalProfile: Profile = {
    [Figure._0]: { x: 0, y: 0, w: size.w, h: size.h * 3 },
    [Figure._1]: { ...CordMultiply(size, { x: 1, y: 2 }), ...size },
    [Figure._2]: { ...CordMultiply(size, { x: 1, y: 1 }), ...size },
    [Figure._3]: { ...CordMultiply(size, { x: 1, y: 0 }), ...size },
    [Figure._4]: { ...CordMultiply(size, { x: 2, y: 2 }), ...size },
    [Figure._5]: { ...CordMultiply(size, { x: 2, y: 1 }), ...size },
    [Figure._6]: { ...CordMultiply(size, { x: 2, y: 0 }), ...size },
    [Figure._7]: { ...CordMultiply(size, { x: 3, y: 2 }), ...size },
    [Figure._8]: { ...CordMultiply(size, { x: 3, y: 1 }), ...size },
    [Figure._9]: { ...CordMultiply(size, { x: 3, y: 0 }), ...size },
    [Figure._10]: { ...CordMultiply(size, { x: 4, y: 2 }), ...size },
    [Figure._11]: { ...CordMultiply(size, { x: 4, y: 1 }), ...size },
    [Figure._12]: { ...CordMultiply(size, { x: 4, y: 0 }), ...size },
    [Figure._13]: { ...CordMultiply(size, { x: 5, y: 2 }), ...size },
    [Figure._14]: { ...CordMultiply(size, { x: 5, y: 1 }), ...size },
    [Figure._15]: { ...CordMultiply(size, { x: 5, y: 0 }), ...size },
    [Figure._16]: { ...CordMultiply(size, { x: 6, y: 2 }), ...size },
    [Figure._17]: { ...CordMultiply(size, { x: 6, y: 1 }), ...size },
    [Figure._18]: { ...CordMultiply(size, { x: 6, y: 0 }), ...size },
    [Figure._19]: { ...CordMultiply(size, { x: 7, y: 2 }), ...size },
    [Figure._20]: { ...CordMultiply(size, { x: 7, y: 1 }), ...size },
    [Figure._21]: { ...CordMultiply(size, { x: 7, y: 0 }), ...size },
    [Figure._22]: { ...CordMultiply(size, { x: 8, y: 2 }), ...size },
    [Figure._23]: { ...CordMultiply(size, { x: 8, y: 1 }), ...size },
    [Figure._24]: { ...CordMultiply(size, { x: 8, y: 0 }), ...size },
    [Figure._25]: { ...CordMultiply(size, { x: 9, y: 2 }), ...size },
    [Figure._26]: { ...CordMultiply(size, { x: 9, y: 1 }), ...size },
    [Figure._27]: { ...CordMultiply(size, { x: 9, y: 0 }), ...size },
    [Figure._28]: { ...CordMultiply(size, { x: 10, y: 2 }), ...size },
    [Figure._29]: { ...CordMultiply(size, { x: 10, y: 1 }), ...size },
    [Figure._30]: { ...CordMultiply(size, { x: 10, y: 0 }), ...size },
    [Figure._31]: { ...CordMultiply(size, { x: 11, y: 2 }), ...size },
    [Figure._32]: { ...CordMultiply(size, { x: 11, y: 1 }), ...size },
    [Figure._33]: { ...CordMultiply(size, { x: 11, y: 0 }), ...size },
    [Figure._34]: { ...CordMultiply(size, { x: 12, y: 2 }), ...size },
    [Figure._35]: { ...CordMultiply(size, { x: 12, y: 1 }), ...size },
    [Figure._36]: { ...CordMultiply(size, { x: 12, y: 0 }), ...size },
    [Figure._1ST12]: { ...CordMultiply(size, { x: 1, y: 3 }), ...line4 },
    [Figure._2ND12]: { ...CordMultiply(size, { x: 5, y: 3 }), ...line4 },
    [Figure._3RD12]: { ...CordMultiply(size, { x: 9, y: 3 }), ...line4 },
    [Figure._1TO18]: { ...CordMultiply(size, { x: 1, y: 3.8 }), ...line6 },
    [Figure._19TO36]: { ...CordMultiply(size, { x: 7, y: 3.8 }), ...line6 },
    [Figure._1_LINE]: { ...CordMultiply(size, { x: 13, y: 0 }), ...line12 },
    [Figure._2_LINE]: { ...CordMultiply(size, { x: 13, y: 1 }), ...line12 },
    [Figure._3_LINE]: { ...CordMultiply(size, { x: 13, y: 2 }), ...line12 },
    [Figure.EVEN]: { ...CordMultiply(size, { x: 1, y: 4.6 }), ...line3 },
    [Figure.ODD]: { ...CordMultiply(size, { x: 4, y: 4.6 }), ...line3 },
    [Figure.RED]: { ...CordMultiply(size, { x: 7, y: 4.6 }), ...line3 },
    [Figure.BLACK]: { ...CordMultiply(size, { x: 10, y: 4.6 }), ...line3 },
    [Figure.ROLL]: { ...CordMultiply(size, { x: 1, y: 7 }), ...line3 },
    [Figure.CONT]: { ...CordMultiply(size, { x: 4, y: 7 }), ...line3 },
    [Figure.FULL_SCREEN]: {
        ...CordMultiply(size, { x: 14.2, y: 7 }),
        ...bidSize
    },
    [Figure.B_HALF]: { ...CordMultiply(bidSize, { x: 9, y: 7.2 }), ...bidSize },
    [Figure.B_ONE]: { ...CordMultiply(bidSize, { x: 10, y: 7.2 }), ...bidSize },
    [Figure.B_FIVE]: {
        ...CordMultiply(bidSize, { x: 11, y: 7.2 }),
        ...bidSize
    },
    [Figure.B_TWENTYFIVE]: {
        ...CordMultiply(bidSize, { x: 12, y: 7.2 }),
        ...bidSize
    },
    [Figure.B_HUNDRED]: {
        ...CordMultiply(bidSize, { x: 13, y: 7.2 }),
        ...bidSize
    },
    [Figure.B_FIVE_HUNDRED]: {
        ...CordMultiply(bidSize, { x: 14, y: 7.2 }),
        ...bidSize
    },
    [Figure.B_THOUSAND]: {
        ...CordMultiply(bidSize, { x: 15, y: 7.2 }),
        ...bidSize
    }
};
