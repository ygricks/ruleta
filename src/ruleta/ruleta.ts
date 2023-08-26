import { Color } from '../color';
import { Rect, RectOption, RectType } from '../rect';
import { ViewPort } from '../viewport';
import { RuletaConfig } from './config';
import { IBid, IConfig, ICont, IWinnerBid } from './intefaces';

export class Ruleta {
    private readonly vp: ViewPort;
    private readonly config: IConfig;
    private cont: ICont;
    private zones: Rect[] = [];
    private redraw: boolean;
    private bids: { [key: string]: IBid } = {};
    private winnerBids: IWinnerBid[] = [];
    constructor() {
        this.vp = new ViewPort();
        this.config = RuletaConfig;
    }

    run() {
        this.cont = this.makeCont();
        this.drawBoard();
    }

    makeCont(): ICont {
        const { start, grid, lineWidth } = this.config;
        const { ui } = this.vp;
        const rect = new Rect(
            start.x + grid.width * 4.5,
            start.y + grid.height * 6,
            grid.width * 3,
            grid.height,
            {
                name: 'cont',
                type: RectType.CONT,
                option: RectOption.cell,
                board: ui,
                borderWidth: lineWidth,
                borderColor: Color.FULLBLACK,
                background: Color.GREEN
            }
        );
        return { rect: rect, value: 10000 };
    }

    drawBoard() {
        const {
            board: { ctx },
            ui
        } = this.vp;
        ctx.fillStyle = Color.DARKGREEN;
        ctx.fillRect(0, 0, this.vp.size.width, this.vp.size.height);
        this.drawCells();
        this.drawOptions();
        this.vp.copy();
        this.drawCont();
        ui.canvas.addEventListener('click', this.click.bind(this));
    }

    drawCells(): void {
        for (let n = 0; n <= 36; n++) {
            const rect = this.getNthRect(n);
            rect.draw();
            this.zones.push(rect);
        }
    }

    drawOptions() {
        const { board } = this.vp;
        const { start, grid, lineWidth } = this.config;

        type Cords = {
            x: number;
            y: number;
            w: number;
            h: number;
            b?: Color;
            t?: RectType;
            o: RectOption;
        };
        const options: { [key: string]: Cords } = {
            '1st12': {
                o: RectOption['1st12'],
                x: 1,
                y: 3,
                w: 4,
                h: 0.8
            },
            '2st12': {
                o: RectOption['2st12'],
                x: 5,
                y: 3,
                w: 4,
                h: 0.8
            },
            '3st12': {
                o: RectOption['3st12'],
                x: 9,
                y: 3,
                w: 4,
                h: 0.8
            },
            '1>18': {
                o: RectOption['1>18'],
                x: 1,
                y: 3.8,
                w: 6,
                h: 0.8
            },
            '19>36': {
                o: RectOption['19>36'],
                x: 7,
                y: 3.8,
                w: 6,
                h: 0.8
            },
            '1_line': {
                o: RectOption['1_line'],
                x: 13,
                y: 0,
                w: 2,
                h: 1
            },
            '2_line': {
                o: RectOption['2_line'],
                x: 13,
                y: 1,
                w: 2,
                h: 1
            },
            '3_line': {
                o: RectOption['3_line'],
                x: 13,
                y: 2,
                w: 2,
                h: 1
            },
            even: {
                o: RectOption.even,
                x: 1,
                y: 4.6,
                w: 3,
                h: 0.8
            },
            odd: {
                o: RectOption.odd,
                x: 4,
                y: 4.6,
                w: 3,
                h: 0.8
            },
            red: {
                o: RectOption.red,
                x: 7,
                y: 4.6,
                w: 3,
                h: 0.8,
                b: Color.RED
            },
            black: {
                o: RectOption.black,
                x: 10,
                y: 4.6,
                w: 3,
                h: 0.8,
                b: Color.BLACK
            },
            ROLL: {
                o: RectOption.button,
                x: 1,
                y: 6,
                w: 3,
                h: 1,
                b: Color.ORANGE,
                t: RectType.ROLL
            }
        };

        for (const oName of Object.keys(options)) {
            const { x, y, w, h, b, t, o } = options[oName];
            const background: Color = b != undefined ? b : Color.GREEN;
            const rect = new Rect(
                start.x + x * grid.width,
                start.y + y * grid.height,
                w * grid.width - lineWidth,
                h * grid.height - lineWidth,
                {
                    name: oName,
                    type: !t ? RectType.OPTION : t,
                    option: o,
                    board: board,
                    borderWidth: lineWidth,
                    borderColor: Color.FULLBLACK,
                    background: background
                }
            ).draw();
            this.zones.push(rect);
        }
    }

    drawCont() {
        this.cont.rect.param.name = this.cont.value.toString();
        this.cont.rect.draw();
    }

    click(event: PointerEvent) {
        const { clientX: x, clientY: y } = event;
        const rect: Rect | null = this.getClickedRect(x, y);
        if (rect === null) {
            if (!Object.keys(this.bids).length) {
                this.vp.copy();
                this.drawCont();
            }
            return;
        }
        switch (rect.param.type) {
            case RectType.ROLL:
                this.clear();
                this.roll();
                break;
            case RectType.CELL:
            case RectType.OPTION: {
                this.clear();
                const bid: IBid = this.addBid({ rect: rect, amount: 100 });
                if (bid) {
                    this.drawBid(bid);
                    this.drawCont();
                }
                break;
            }
            default: {
                console.warn(
                    `click on type: "${rect.param.type}" & name: ${rect.param.name} is not privided`
                );
                break;
            }
        }
    }

    clear() {
        if (this.redraw) {
            this.redraw = false;
            this.vp.copy();
            this.drawCont();
        }
    }

    getClickedRect(x: number, y: number): Rect | null {
        for (const rect of this.zones) {
            if (
                rect.x < x &&
                x < rect.x + rect.w &&
                rect.y < y &&
                y < rect.y + rect.h
            ) {
                return rect;
            }
        }
        return null;
    }

    roll() {
        const { ui } = this.vp;
        const ball: number = Math.floor(Math.random() * 37);
        const originalRect: Rect = this.zones.find(
            (e) =>
                e.param.type === RectType.CELL &&
                e.param.name === ball.toString()
        );
        originalRect
            .clone({ borderColor: Color.YELLOW, background: null })
            .drawRect(ui);
        console.log(`BALL: ${ball}`);
        let income = 0;
        let outcome = 0;
        if (Object.keys(this.bids).length) {
            for (const bid of Object.values(this.bids)) {
                outcome += bid.amount;
                const multiplier = this.bidMultiplier(bid, ball);
                if (multiplier) {
                    const winnerBid: IWinnerBid = {
                        rect: bid.rect,
                        amount: bid.amount,
                        multiplier: multiplier,
                        sum: bid.amount * multiplier
                    };
                    this.winnerBids.push(winnerBid);
                    income += winnerBid.sum;
                    console.log(
                        `order: ${bid.rect.param.name}, amount: ${
                            bid.amount
                        } * ${multiplier}, pureIncome: ${
                            bid.amount * multiplier - bid.amount
                        }`
                    );
                }
            }
        }
        console.log(
            `WIN: ${income}, SPEND: ${outcome}, step: ${income - outcome}`
        );
        this.cont.value += income;
        this.drawCont();
        // clear bids
        this.bids = {};
        this.winnerBids = [];
        // clear drawer
        this.redraw = true;
    }

    bidMultiplier(bid: IBid, ball: number): number {
        const ballString = ball.toString();
        const {
            rect: {
                param: { name: bidName }
            }
        } = bid;

        const cell: Rect = this.zones.find((z) => z.param.name === ballString);
        const { name: ballName } = cell.param;

        // console.log(`bidName: ${bidName} || ballName: ${ballName}`);

        if (bid.rect.param.type === RectType.CELL) {
            if (bidName === ballName) {
                return 36;
            } else {
                return 0;
            }
        }

        switch (bid.rect.param.name) {
            // case : {
            //     if(rect.name === cell.name) {
            //         return 36;
            //     }
            // };
            case 'odd':
                if (ball !== 0 && ball % 2 === 1) {
                    return 2;
                }
                break;
            case 'even':
                if (ball !== 0 && ball % 2 === 0) {
                    return 2;
                }
                break;
            case 'red':
                if (cell.param.background === Color.RED) {
                    return 2;
                }
                break;
            case 'black':
                if (cell.param.background === Color.BLACK) {
                    return 2;
                }
                break;
            case '1_line':
                if (ball % 3 === 0) {
                    return 3;
                }
                break;
            case '2_line':
                if (ball % 3 === 2) {
                    return 3;
                }
                break;
            case '3_line':
                if (ball % 3 === 1) {
                    return 3;
                }
                break;
            case '1st12':
                if (1 <= ball && ball <= 12) {
                    return 3;
                }
                break;
            case '2st12':
                if (13 <= ball && ball <= 24) {
                    return 3;
                }
                break;
            case '3st12':
                if (25 <= ball && ball <= 36) {
                    return 3;
                }
                break;
            case '1>18':
                if (1 <= ball && ball <= 18) {
                    return 2;
                }
                break;
            case '19>36':
                if (19 <= ball && ball <= 36) {
                    return 2;
                }
                break;

            default: {
                throw new Error(
                    `Can't find option for bid name: "${bid.rect.param.name}" type: ${bid.rect.param.type}`
                );
                break;
            }
        }
        return 0;
    }

    addBid(bid: IBid): IBid {
        const key = `${bid.rect.param.name}.${bid.rect.x}.${bid.rect.y}`;
        const keys = Object.keys(this.bids);
        if (this.cont.value >= bid.amount) {
            this.cont.value -= bid.amount;
        } else {
            return null;
        }
        if (keys.includes(key)) {
            bid.amount += this.bids[key].amount;
            this.bids[key] = bid;
        } else {
            this.bids[key] = bid;
        }

        return bid;
    }

    drawBid(bid: IBid) {
        const {
            ui: { ctx },
            ui
        } = this.vp;
        const {
            rect: { w, h },
            rect
        } = bid;

        const radius = 18;
        const bidMargin = 10;
        const x = rect.x - bidMargin;
        const y = rect.y - bidMargin;
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
                name: bid.amount.toString(),
                type: RectType.CELL,
                option: RectOption.cell
            }
        ).drawText(ui, 14);
    }

    getNthRect(n: number): Rect {
        const {
            grid: { width, height },
            start,
            lineWidth
        } = this.config;
        const firstRed = n < 11 || (n > 18 && n < 29);
        const even = n % 2 == 0;
        const color =
            n == 0
                ? Color.GREEN
                : firstRed
                ? even
                    ? Color.BLACK
                    : Color.RED
                : even
                ? Color.RED
                : Color.BLACK;
        const x = Math.ceil(n / 3);
        const y = n % 3 == 0 ? 0 : n % 3 == 2 ? 1 : 2;
        const rect = new Rect(
            x * width + start.x,
            y * height + start.y,
            width - lineWidth,
            (n != 0 ? 1 : 3) * height - lineWidth,
            {
                name: n.toString(),
                type: RectType.CELL,
                option: RectOption.cell,
                background: color,
                board: this.vp.board,
                borderColor: Color.FULLBLACK,
                borderWidth: lineWidth
            }
        );
        return rect;
    }
}
