import { Color } from '../color';
import {
    Figure,
    FigureBidAmount,
    FigureCell,
    FigureKeys,
    FigureOption,
    FigureSpecial,
    FigureText,
    GetColor,
    GetFigureByKey,
    GetFigureByValue,
    HorizontalProfile,
    Profile,
    Shape
} from '../figure';
import { Action, Ruleta } from '../ruleta';
import { ViewPort } from '../viewport';
import { clearRect, drawRectBorder, drawRectOn, drawTextOn } from './drawTools';

export class ByCanvas {
    private readonly vp: ViewPort;
    private profile: Profile;
    private nextClickClear: boolean = false;
    private bidAmount: FigureBidAmount = FigureBidAmount.B_ONE;
    private lose: boolean = false;

    constructor(public readonly ruleta: Ruleta) {
        this.profile = HorizontalProfile;
        const shape = this.getMinSize();
        this.vp = new ViewPort(shape);
        this.register();
    }

    private register(): void {
        this.ruleta.on(Action.START, this._start.bind(this));
        this.ruleta.on(Action.ROLL, this._roll.bind(this));
        this.ruleta.on(Action.RESTART, this._restart.bind(this));
        this.ruleta.on(Action.LOSE, this._lose.bind(this));
    }

    private _start() {
        this.drawBoard();
        this.drawUI();
        this.vp.view();
    }

    private _roll(_figure: any) {
        const figure = _figure as Figure;
        this.drawUI(figure);
        this.vp.view();
    }

    private _restart(_figure: any) {
        this.lose = false;
        this.drawUI();
        this.vp.view();
    }

    private _lose() {
        this.lose = true;
        const { out } = this.vp;
        const figure = Figure.LOSE;
        const p = this.profile[figure];
        drawRectOn(out, p, GetColor(figure));
        drawTextOn(out, p, FigureText[figure]);
    }

    private getMinSize(): Shape {
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

    private drawBoard() {
        this.drawFigures();
        this.vp.out.canvas.addEventListener('click', this.click.bind(this));
    }

    private drawFigures(): void {
        const { board } = this.vp;
        for (const key in Figure) {
            const figure = GetFigureByKey(key);
            if (figure === Figure.LOSE || figure === Figure.FULL_SCREEN) {
                continue;
            }
            const p = this.profile[figure];
            drawRectOn(board, p, GetColor(figure));
            drawTextOn(board, p, FigureText[figure]);
        }
    }

    private click(event: PointerEvent) {
        if (this.lose) {
            this.ruleta.tryAgain();
            return;
        }
        const { clientX: x, clientY: y } = event;
        const figure: Figure | null = this.getClickedFigure(x, y);
        if (this.nextClickClear) {
            this.nextClickClear = false;
            this.vp.ui.clear();
        }
        if (figure === null) {
            if (!Object.keys(this.ruleta.getBids()).length) {
                this.drawUI();
                this.vp.view();
            }
            return;
        }
        const bidAmount = parseFloat(this.bidAmount.toString().slice(2)); // @TODO chenge by selected amount
        if (FigureCell.hasOwnProperty(FigureKeys[figure])) {
            this.ruleta.addBid(figure, bidAmount);
        } else if (FigureOption.hasOwnProperty(FigureKeys[figure])) {
            this.ruleta.addBid(figure, bidAmount);
        } else if (FigureSpecial.hasOwnProperty(FigureKeys[figure])) {
            if (figure === Figure.ROLL) {
                this.ruleta.roll();
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

    private getClickedFigure(x: number, y: number): Figure | null {
        for (const key in Figure) {
            const figure = GetFigureByKey(key);
            const rect = this.profile[figure];
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

    private drawUI(figure?: Figure) {
        this.vp.ui.clear();
        this.drawCont();
        this.drawBids();
        this.drawActiveAmount();
        if (figure) {
            drawRectBorder(this.vp.ui, this.profile[figure], Color.YELLOW);
        }
    }

    private drawCont() {
        const { ui } = this.vp;

        const profile = this.profile[Figure.CONT];
        clearRect(ui, profile);
        drawTextOn(ui, profile, {
            text: this.ruleta.getCont().toString(),
            size: FigureText[Figure.CONT].size
        });
    }
    private drawBids() {
        for (const key of Object.keys(this.ruleta.getBids())) {
            const figure: Figure = GetFigureByValue(key);
            this.drawBid(figure);
        }
    }
    private drawBid(figure: Figure) {
        const {
            ui: { ctx },
            ui
        } = this.vp;
        const bids = this.ruleta.getBids();
        const amount = bids[figure];
        let { x, y, w, h } = this.profile[figure];
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
        drawTextOn(
            ui,
            {
                x: x + w - radius,
                y: y + h - radius + 1,
                w: radius * 2,
                h: radius * 2
            },
            {
                text: amount.toString(),
                size: 14
            }
        );
    }

    private drawActiveAmount() {
        const index = Object.values(FigureBidAmount).indexOf(this.bidAmount);
        const key = Object.keys(FigureBidAmount)[index];
        const figure = Figure[key as keyof typeof Figure];
        drawRectBorder(this.vp.ui, this.profile[figure], Color.LIME);
    }
}
