import { Color } from '../color';
import {
    Figure,
    FigureBidAmount,
    FigureCell,
    FigureKeys,
    FigureOption,
    FigureText,
    GetColor,
    GetFigureByKey,
    GetFigureByValue,
    HorizontalProfile,
    Profile,
    Shape
} from '../figure';
import { Action, Ruleta } from '../ruleta';

type Styles = { [key: string]: string | number };

export class BySVG {
    private body: HTMLElement;
    private svg: Element;
    private ns: string = 'http://www.w3.org/2000/svg';
    private profile: Profile = HorizontalProfile;
    private bidAmount: FigureBidAmount;
    private bidsGroup: Element;
    private clear: boolean = false;
    private fullScreen: boolean = false;

    constructor(public readonly ruleta: Ruleta) {
        this.init();
        this.listen();
    }

    private listen() {
        this.ruleta.on(Action.START, this._start.bind(this));
        this.ruleta.on(Action.ROLL, this._roll.bind(this));
        this.ruleta.on(Action.RESTART, this._restart.bind(this));
        this.ruleta.on(Action.CONT_CHANGE, this._cont_changed.bind(this));
        this.svg.addEventListener('click', this.click.bind(this));
        window.addEventListener('resize', this.resize.bind(this));
    }

    private resize(event: Event) {
        const screen: Shape = { w: window.innerWidth, h: window.innerHeight };
        const minSize = this.getMinSize();
        let scale = Math.min(screen.w / minSize.w, screen.h / minSize.h);
        scale = parseFloat(scale.toFixed(4));
        const translate: Shape = {
            w: (screen.w - minSize.w) / 2,
            h: (screen.h - minSize.h) / 2
        };
        BySVG.writeAttributes(this.svg, {
            style: `transform: translate(${parseInt(
                translate.w + ''
            )}px, ${parseInt(translate.h + '')}px) scale(${scale})`
        });
    }

    private _start() {
        // this.viewBid(Figure.CONT);
        this.resize(new Event('nope'));
    }

    private _roll(_figure: any) {
        const figure = _figure as Figure;
        const key = FigureKeys[figure];
        const group = this.svg.querySelector(`[data-figure=${key}]`);
        group.classList.add('rolled_bid');
        this.clear = true;
    }

    private _restart() {
        this._clear();
    }

    private _cont_changed(_contValue: any) {
        const text = this.svg.querySelector(`g[data-figure="CONT"]>text`);
        text.innerHTML = _contValue.toString();
    }

    private _clear() {
        const bid = this.svg.querySelector('.rolled_bid');
        if (bid) {
            bid.classList.remove('rolled_bid');
        }
        this.bidsGroup.innerHTML = '';
    }

    private click(event: Event) {
        if (this.clear) {
            this._clear();
            this.clear = false;
        }
        const targetGroup = (event.target as Element).parentElement;
        const figureKey = targetGroup.getAttribute('data-figure');

        if (!figureKey) {
            console.warn('no figureKey for that click');
            return;
        }
        const figure = GetFigureByKey(figureKey);
        if (!figure) {
            throw new Error(
                `no figure for figureKey:${figureKey}, can't happing!`
            );
        }
        if (
            FigureCell.hasOwnProperty(figureKey) ||
            FigureOption.hasOwnProperty(figureKey)
        ) {
            const bidAmount = parseFloat(this.bidAmount.toString().slice(2));
            this.ruleta.addBid(figure, bidAmount);
            this.viewBids();
        } else if (FigureBidAmount.hasOwnProperty(figureKey)) {
            this.selectBidAmount(figure);
        } else if (figure === Figure.ROLL) {
            this.ruleta.roll();
        } else if (figure === Figure.FULL_SCREEN) {
            this.triggerFullScreen();
        }
    }

    private selectBidAmount(figure: Figure): void {
        if (this.bidAmount) {
            const oldKey = FigureKeys[this.bidAmount];
            const oldBidBlock = this.svg.querySelector(
                `g[data-figure=${oldKey}]`
            );
            oldBidBlock.classList.remove('selected_bid');
        }
        const key = FigureKeys[figure];
        const group = this.svg.querySelector(`g[data-figure=${key}]`);
        group.classList.add('selected_bid');
        this.bidAmount = figure as FigureBidAmount;
    }

    private viewBids() {
        const bids = this.ruleta.getBids();
        for (const key of Object.keys(bids)) {
            const figure: Figure = GetFigureByValue(key);
            this.viewBid(figure, bids[figure]);
        }
    }

    private viewBid(figure: Figure, amount: number) {
        const dom = this.getDomdBid(figure, amount);
        dom.querySelector('text').innerHTML = amount.toString();
    }

    initDom() {
        this.body = document.getElementsByTagName('body')[0];
        this.svg = document.createElementNS(this.ns, 'svg');
        this.body.appendChild(this.svg);
        BySVG.writeStyle(this.body, {
            background: Color.DARKGREEN,
            overflow: 'hidden'
        });
        const minSize = this.getMinSize();
        BySVG.writeAttributes(this.svg, {
            xmlns: 'http://www.w3.org/2000/svg',
            'xmlns:xlink': 'http://www.w3.org/1999/xlink',
            width: minSize.w,
            height: minSize.h
        });
    }

    private getMinSize(): Shape {
        let size = null;
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

    getDomdBid(figure: Figure, amount: number): Element {
        const key = FigureKeys[figure];
        const dataBid = `bid_${key}`;
        let g = this.svg.querySelector(`[data-bid=${dataBid}]`);
        if (!g) {
            const radius = 15;
            const margin = 10;
            const profile = this.profile[figure];
            let { x, y, w, h } = profile;
            x += w - margin;
            y += h - margin;
            w = radius * 2;
            h = radius * 2;
            g = document.createElementNS(this.ns, 'g');
            this.bidsGroup.appendChild(g);
            BySVG.writeAttributes(g, {
                'data-bid': dataBid,
                transform: `translate(${x.toFixed(0)}, ${y.toFixed(0)})`
            });
            const circle = document.createElementNS(this.ns, 'circle');
            g.appendChild(circle);
            BySVG.writeAttributes(circle, {
                cx: 0,
                cy: 0,
                r: radius,
                fill: Color.BID
            });

            const textProp = { text: amount.toString(), size: 14 };
            const textField = document.createElementNS(this.ns, 'text');
            g.appendChild(textField);
            const textAttrs = {
                x: 0,
                y: 0,
                'alignment-baseline': 'middle',
                'text-anchor': 'middle'
            };
            textField.innerHTML = textProp.text;
            BySVG.writeAttributes(textField, textAttrs);
        }
        return g;
    }

    init() {
        this.initDom();
        this.createFigure();
        this.selectBidAmount(Figure.B_FIVE);
    }

    private createFigure() {
        const textDefault = {
            'alignment-baseline': 'middle',
            'stroke-width': 0
        };
        for (const key in Figure) {
            const g = document.createElementNS(this.ns, 'g');
            this.svg.appendChild(g);

            const figure = GetFigureByKey(key);
            const profile = this.profile[figure];
            const color = GetColor(figure);
            const text = FigureText[figure];
            const rectStyle: Styles = {
                width: profile.w.toFixed(0) + 'px',
                height: profile.h.toFixed(0) + 'px',
                fill: color
            };
            BySVG.writeAttributes(g, {
                transform: `translate(${profile.x.toFixed(
                    0
                )}, ${profile.y.toFixed(0)})`,
                'data-figure': key
            });
            const rect = document.createElementNS(this.ns, 'rect');
            BySVG.writeStyle(rect, rectStyle);
            g.appendChild(rect);

            if (!text.text.length) {
                text.text = '';
            }
            const textField = document.createElementNS(this.ns, 'text');
            textField.innerHTML = text.text;
            textField.classList.add(`fs${text.size}`);
            g.appendChild(textField);
            BySVG.writeAttributes(textField, {
                ...textDefault,
                x: profile.w / 2,
                y: profile.h / 2,
                'font-size': text.size
            });
        }
        this.bidsGroup = document.createElementNS(this.ns, 'g');
        this.svg.appendChild(this.bidsGroup);
        BySVG.writeAttributes(this.bidsGroup, { 'data-bids': '---bids---' });
    }

    private triggerFullScreen() {
        if (this.fullScreen) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
        this.fullScreen = !this.fullScreen;
    }

    private static writeStyle(ob: Element, styles: Styles) {
        let style: string[] = [];
        for (const key in styles) {
            if (typeof styles[key] === 'number') {
                style.push(`${key}:${(styles[key] as number).toFixed(0)};`);
            } else {
                style.push(`${key}:${styles[key]};`);
            }
        }
        ob.setAttribute('style', style.join(''));
        return ob;
    }

    private static writeAttributes(ob: Element, attr: Styles) {
        for (const a in attr) {
            if (a == 'text') {
                ob.innerHTML = attr[a].toString();
            } else {
                if (typeof attr[a] === 'number') {
                    ob.setAttribute(a, (attr[a] as number).toFixed(0));
                } else {
                    ob.setAttribute(a, attr[a].toString());
                }
            }
        }
        return ob;
    }
}
