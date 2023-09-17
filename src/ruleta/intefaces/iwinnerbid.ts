import { Figure } from '../../figure';

export interface IWinnerBid {
    figure: Figure;
    amount: number;
    multiplier: number;
    sum: number;
}
