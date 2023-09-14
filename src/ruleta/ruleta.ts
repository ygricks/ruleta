import { Color, BidColor } from '../color';
import {
    Figure,
    FigureCell,
    FigureOption,
    FigureSpecial,
    FigureText,
    HorizontalProfile,
    Profile,
    FigureKeys,
    GetFigureByKey,
    GetFigureByValue,
    GetColor
} from '../figure';
import { Rect } from '../rect';
import { ViewPort } from '../viewport';
import { RuletaConfig } from './config';
import { IConfig, ICont, IWinnerBid } from './intefaces';

export class Ruleta {
    private readonly vp: ViewPort;
    private readonly config: IConfig;
    private cont: ICont;
    private zones: Partial<{ [key in Figure]: Rect }> = {};
    private nextClickRedraw: boolean;
    private bids: Partial<{ [key in Figure]: number }> = {};
    private winnerBids: IWinnerBid[] = [];
    private profile: Profile;
    constructor() {
        this.vp = new ViewPort();
        this.config = RuletaConfig;

        // @TODO choise profile || autodetect
        this.profile = HorizontalProfile;
    }

    run() {
        this.cont = { value: 10000 };
        this.drawBoard();
        this.vp.view();
    }

    drawBoard() {
        const {
            vp: {
                board: { ctx },
                size: { width, height },
                out
            }
        } = this;
        ctx.fillStyle = Color.DARKGREEN;
        ctx.fillRect(0, 0, width, height);
        this.drawFigures();
        // this.drawBidsAmount();
        this.drawCont();
        out.canvas.addEventListener('click', this.click.bind(this));
    }

    // drawBidsAmount() {
    //     const {
    //         board: { ctx },
    //         board
    //     } = this.vp;
    //     const amounts: { x: number; y: number; c: BidColor; n: string }[] = [
    //         { x: 700, y: 480, n: '0.5', c: BidColor.HALF },
    //         { x: 760, y: 480, n: '1', c: BidColor.ONE },
    //         { x: 820, y: 480, n: '5', c: BidColor.FIVE },
    //         { x: 880, y: 480, n: '25', c: BidColor.TWENTYFILE },
    //         { x: 940, y: 480, n: '100', c: BidColor.HUNDRED },
    //         { x: 1000, y: 480, n: '500', c: BidColor.FIVE_HUNDRED },
    //         { x: 1060, y: 480, n: '1k', c: BidColor.THOUSAND }
    //     ];
    //     for (const amount of amounts) {
    //         const { x, y, c, n } = amount;
    //         const rect = new Rect(
    //             x,
    //             y,
    //             this.config.grid.width,
    //             this.config.grid.height,
    //             {
    //                 name: n,
    //                 // option: RectOption.BID_AMOUNT,
    //                 background: c,
    //                 board: board,
    //                 fontSize: 24
    //             }
    //         ).draw();
    //         // ctx.beginPath();
    //         // ctx.arc(x, y, 25, 0, 2 * Math.PI);
    //         // ctx.fillStyle = c;
    //         // ctx.stroke();
    //         // ctx.fill();
    //     }
    // }

    drawFigures(): void {
        const tipicStyle = {
            board: this.vp.board,
            borderColor: Color.FULLBLACK,
            borderWidth: this.config.lineWidth
        };

        for (const key in Figure) {
            const figure = GetFigureByKey(key);
            const style = {
                ...tipicStyle,
                background: GetColor(figure),
                name: FigureText[figure].text,
                fontSize: FigureText[figure].size
            };
            const p = this.profile[figure];
            const rect = new Rect(p.x, p.y, p.w, p.h, style);
            this.zones[figure] = rect;
            rect.draw();
        }
    }

    drawCont() {
        const {
            vp: { ui },
            vp
        } = this;
        const { x, y, w, h } = this.profile[Figure.CONT];
        const { size } = FigureText[Figure.CONT];
        ui.ctx.clearRect(x, y, w, h);
        Rect.drawTextOn(ui, x, y, w, h, {
            text: this.cont.value.toString(),
            size
        });
    }

    click(event: PointerEvent) {
        const { clientX: x, clientY: y } = event;
        const figure: Figure | null = this.getClickedFigure(x, y);
        if (this.nextClickRedraw) {
            this.nextClickRedraw = false;
            this.vp.ui.clear();
        }
        if (figure === null) {
            if (!Object.keys(this.bids).length) {
                this.drawCont();
                this.vp.view();
            }
            return;
        }

        const bidAmount = 100; // @TODO chenge by selected amount

        if (FigureCell.hasOwnProperty(FigureKeys[figure])) {
            this.addBid(figure, bidAmount);
        } else if (FigureOption.hasOwnProperty(FigureKeys[figure])) {
            this.addBid(figure, bidAmount);
        } else if (FigureSpecial.hasOwnProperty(FigureKeys[figure])) {
            if (figure === Figure.ROLL) {
                this.roll();
                return;
            }
        } else {
            console.error(new Error(`imposible click ${figure}`));
        }
        this.vp.view();
    }

    getClickedFigure(x: number, y: number): Figure | null {
        for (const key in Figure) {
            const figure = GetFigureByKey(key);
            const rect = this.zones[figure];
            if (
                rect.x < x &&
                x < rect.x + rect.w &&
                rect.y < y &&
                y < rect.y + rect.h
            ) {
                return figure;
            }
        }
        return null;
    }

    roll() {
        const {
            vp: { ui },
            vp
        } = this;
        const ball: number = Math.floor(Math.random() * 37);
        const figure: Figure = GetFigureByValue(ball.toString());
        if (!figure) {
            console.error(new Error(`figure was not found ${ball}`));
            return;
        }
        const originalRect: Rect = this.zones[figure];
        originalRect
            .clone({ borderColor: Color.YELLOW, background: null })
            .drawRect(ui);
        let income = 0;
        let outcome = 0;
        if (Object.keys(this.bids).length) {
            for (const bid in this.bids) {
                const bidFigure: Figure = GetFigureByValue(bid);
                const amount: number = this.bids[bidFigure];
                const rect: Rect = this.zones[bidFigure];
                outcome += amount;
                const multiplier = this.bidMultiplier(bidFigure, figure);
                if (multiplier) {
                    const winnerBid: IWinnerBid = {
                        rect: rect,
                        amount: amount,
                        multiplier: multiplier,
                        sum: amount * multiplier
                    };
                    this.winnerBids.push(winnerBid);
                    income += winnerBid.sum;
                    console.log(
                        `    + order: ${
                            rect.param.name
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
        this.drawCont();
        this.bids = {};
        this.winnerBids = [];
        vp.view();
        this.nextClickRedraw = true;
    }

    bidMultiplier(bidFigure: Figure, ballFigure: Figure): number {
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
            }
        }
        return 0;
    }

    addBid(figure: Figure, amount: number): void {
        if (this.cont.value >= amount) {
            this.cont.value -= amount;
        } else {
            return null;
        }
        if (this.bids[figure]) {
            this.bids[figure] += amount;
        } else {
            this.bids[figure] = amount;
        }
        this.drawBid(figure);
        this.drawCont();
    }

    drawBid(figure: Figure) {
        const {
            ui: { ctx },
            ui
        } = this.vp;

        const rect = this.zones[figure];
        const amount = this.bids[figure];
        let { x, y, w, h } = rect;

        const radius = 18;
        const bidMargin = 10;
        x = x - bidMargin;
        y = y - bidMargin;
        ctx.beginPath();
        ctx.fillStyle = Color.BID;
        ctx.beginPath();
        ctx.arc(x + w, y + h, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        const irect = new Rect(
            x + w - radius,
            y + h - radius + 1,
            radius * 2,
            radius * 2,
            {
                name: amount.toString(),
                fontSize: 14
            }
        ).drawText(ui);
    }
}
