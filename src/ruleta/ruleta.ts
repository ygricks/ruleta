import { Color } from '../color';
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
    GetColor,
    FigureBidAmount,
    ProfileEnumerate,
    Shape
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
    private nextClickClear: boolean;
    private bids: Partial<{ [key in Figure]: number }> = {};
    private winnerBids: IWinnerBid[] = [];
    private profile: Profile;
    private bidAmount: FigureBidAmount;
    constructor() {
        this.profile = HorizontalProfile;
        const shape = this.getMinSize();
        this.vp = new ViewPort(shape);
        this.config = RuletaConfig;

        // @TODO choise profile || autodetect
    }

    run() {
        this.cont = { value: 100 };
        this.bidAmount = FigureBidAmount.B_ONE;
        this.drawBoard();
        this.drawUI();
        this.vp.view();
    }

    getMinSize(): Shape {
        let w: number = 0;
        let h: number = 0;
        for (const key in Figure) {
            const figure = GetFigureByKey(key);
            const p = this.profile[figure];
            const fw = p.x + p.w;
            const fh = p.y + p.h;
            if (fw > w) {
                w = fw;
            }
            if (fh > h) {
                h = fh;
            }
        }
        return { w, h };
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
        out.canvas.addEventListener('click', this.click.bind(this));
    }

    drawUI(figure?: Figure) {
        this.vp.ui.clear();

        this.drawCont();
        this.drawBids();
        this.drawActiveAmount();
        if (figure) {
            const originalRect: Rect = this.zones[figure];
            originalRect
                .clone({ borderColor: Color.YELLOW, background: null })
                .drawRect(this.vp.ui);
        }
    }

    drawCont() {
        const { ui } = this.vp;

        const tuple = ProfileEnumerate(this.profile[Figure.CONT]);
        ui.ctx.clearRect(...tuple);
        Rect.drawTextOn(ui, ...tuple, {
            text: this.cont.value.toString(),
            size: FigureText[Figure.CONT].size
        });
    }

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

    click(event: PointerEvent) {
        const { clientX: x, clientY: y } = event;
        const figure: Figure | null = this.getClickedFigure(x, y);
        if (this.nextClickClear) {
            this.nextClickClear = false;
            this.bids = {};
            this.winnerBids = [];
            this.vp.ui.clear();
        }
        if (figure === null) {
            if (!Object.keys(this.bids).length) {
                this.drawUI();
                this.vp.view();
            }
            return;
        }

        const bidAmount = parseFloat(this.bidAmount.toString().slice(2)); // @TODO chenge by selected amount

        if (FigureCell.hasOwnProperty(FigureKeys[figure])) {
            this.addBid(figure, bidAmount);
        } else if (FigureOption.hasOwnProperty(FigureKeys[figure])) {
            this.addBid(figure, bidAmount);
        } else if (FigureSpecial.hasOwnProperty(FigureKeys[figure])) {
            if (figure === Figure.ROLL) {
                this.roll();
                return;
            }
        } else if (FigureBidAmount.hasOwnProperty(FigureKeys[figure])) {
            this.bidAmount = figure as undefined as FigureBidAmount;
        } else {
            console.error(new Error(`imposible click ${figure}`));
        }
        this.drawUI();
        this.vp.view();
    }

    drawActiveAmount() {
        const { ui } = this.vp;
        const index = Object.values(FigureBidAmount).indexOf(this.bidAmount);
        const key = Object.keys(FigureBidAmount)[index];
        const figure = Figure[key as keyof typeof Figure];

        // const p = this.profile[figure];
        const originalRect: Rect = this.zones[figure];
        originalRect
            .clone({ borderColor: Color.LIME, background: null })
            .drawRect(ui);
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
        this.drawUI(figure);
        vp.view();
        this.nextClickClear = true;
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
    }

    drawBids() {
        for (const key of Object.keys(this.bids)) {
            const figure: Figure = GetFigureByValue(key);
            this.drawBid(figure);
        }
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
