import { Color } from '../color';
import {
    Figure,
    FigureCell,
    FigureOption,
    FigureText,
    FigureKeys,
    GetFigureByValue,
    GetColor
} from '../figure';
import { ICont, IWinnerBid } from './intefaces';
import { Action } from './actions';

export type Bids = { [key in Figure]?: number };

export class Ruleta {
    private cont: ICont;
    private bids: Bids = {};
    private winnerBids: IWinnerBid[] = [];
    private watch: { [key in Action]?: Function[] } = {};
    public on(action: Action, func: Function) {
        if (!Object.keys(this.watch).includes(action)) {
            this.watch[action] = [];
        }
        this.watch[action].push(func);
    }
    private runAction(action: Action, ...params: any) {
        if (Object.keys(this.watch).includes(action)) {
            for (const func of this.watch[action]) {
                func(...params);
            }
        }
    }

    public constructor() {}

    public getCont(): number {
        return this.cont.value;
    }

    public getBids(): Bids {
        const bids = JSON.parse(JSON.stringify(this.bids)) as Bids;
        return bids;
    }

    public start() {
        this.cont = { value: 100 };
        this.runAction(Action.CONT_CHANGE, this.cont.value);
        this.runAction(Action.START);
    }

    public async roll() {
        const ball: number = Math.floor(Math.random() * 37);
        const figure: Figure = GetFigureByValue(ball.toString());
        if (!figure) {
            console.error(new Error(`figure was not found ${ball}`));
            return;
        }
        let income = 0;
        let outcome = 0;
        if (Object.keys(this.bids).length) {
            for (const bid in this.bids) {
                const bidFigure: Figure = GetFigureByValue(bid);
                const amount: number = this.bids[bidFigure];
                outcome += amount;
                const multiplier = this.bidMultiplier(bidFigure, figure);
                if (multiplier) {
                    const winnerBid: IWinnerBid = {
                        figure,
                        amount,
                        multiplier,
                        sum: amount * multiplier
                    };
                    this.winnerBids.push(winnerBid);
                    income += winnerBid.sum;
                    console.log(
                        `    + order: ${
                            FigureText[bidFigure].text
                        }, amount: ${amount} * ${multiplier}, pureIncome: ${
                            amount * multiplier - amount
                        }`
                    );
                }
            }
        }
        console.log(
            `WIN: ${income} | OUT: ${outcome}, IN: ${income - outcome}`
        );
        this.cont.value += income;
        this.runAction(Action.CONT_CHANGE, this.cont.value);
        this.runAction(Action.ROLL, figure);
        this.bids = {};
        this.winnerBids = [];
        if (this.cont.value === 0) {
            await this.tryAgain();
        }
    }

    private async tryAgain() {
        if (confirm('you lose\ndo you want to try again ?')) {
            this.cont.value = 100;
            this.runAction(Action.CONT_CHANGE, this.cont.value);
            this.runAction(Action.RESTART);
        }
    }

    private bidMultiplier(bidFigure: Figure, ballFigure: Figure): number {
        if (FigureCell.hasOwnProperty(FigureKeys[bidFigure])) {
            if (bidFigure === ballFigure) {
                return 36;
            }
        } else if (FigureOption.hasOwnProperty(FigureKeys[bidFigure])) {
            const ball: number = parseInt(ballFigure);
            switch (bidFigure) {
                case FigureOption._1ST12:
                    if (1 <= ball && ball <= 12) {
                        return 3;
                    }
                    break;
                case FigureOption._2ND12:
                    if (13 <= ball && ball <= 24) {
                        return 3;
                    }
                    break;
                case FigureOption._3RD12:
                    if (25 <= ball && ball <= 36) {
                        return 3;
                    }
                    break;
                case FigureOption._1TO18:
                    if (1 <= ball && ball <= 18) {
                        return 2;
                    }
                    break;
                case FigureOption._19TO36:
                    if (19 <= ball && ball <= 36) {
                        return 2;
                    }
                    break;
                case FigureOption._1_LINE:
                    if (ball % 3 === 0) {
                        return 3;
                    }
                    break;
                case FigureOption._2_LINE:
                    if (ball % 3 === 2) {
                        return 3;
                    }
                    break;
                case FigureOption._3_LINE:
                    if (ball % 3 === 1) {
                        return 3;
                    }
                    break;
                case FigureOption.EVEN:
                    if (ball !== 0 && ball % 2 === 0) {
                        return 2;
                    }
                    break;
                case FigureOption.ODD:
                    if (ball !== 0 && ball % 2 === 1) {
                        return 2;
                    }
                    break;
                case FigureOption.RED:
                    if (GetColor(ballFigure) === Color.RED) {
                        return 2;
                    }
                    break;
                case FigureOption.BLACK:
                    if (GetColor(ballFigure) === Color.BLACK) {
                        return 2;
                    }
                    break;
                default:
                    throw new Error(
                        `that figure is now allowed "${bidFigure}"`
                    );
            }
        }
        return 0;
    }

    public addBid(figure: Figure, amount: number): void {
        if (this.cont.value >= amount) {
            this.cont.value -= amount;
            this.runAction(Action.CONT_CHANGE, this.cont.value);
        } else {
            return null;
        }
        if (this.bids[figure]) {
            this.bids[figure] += amount;
        } else {
            this.bids[figure] = amount;
        }
    }
}
