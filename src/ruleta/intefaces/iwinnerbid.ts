import { Rect } from "../../rect";

export interface IWinnerBid {
    rect: Rect,
    amount: number,
    multiplier: number,
    sum: number,
}
