import { RectType, ViewPort, Rect, RectOption } from "./types";
import { Cells } from "./cells";
import { Color } from './config';


const zones: Rect[] = [];
// start drawing board from next point
const start: { x: number, y: number } = { x: 50, y: 30 };
// cell size
const grid: { width: number, height: number } = { width: 76, height: 70 };
// canvas size
const lineWidth: number = 2;
//  cont
const cont: {rect:Rect, value:number} = (function() {
    const rect = new Rect(start.x+grid.width*4.5, start.y+grid.height*6, grid.width*3, grid.height, {
        name: 'cont',
        type: RectType.CONT,
        option: RectOption.cell,
        borderWidth: lineWidth,
        borderColor: Color.FULLBLACK,
        background: Color.GREEN,
    });
    return {rect: rect, value: 10000};
})();

// clean start, start with clean board, true after Roll click
let cleanStart = true;

function drawCells(vp: ViewPort, ) {
    const { board } = vp;
    for(let i=1; i <= 36; i++) {
        const c = Cells[i];
        
        const rect = (new Rect(
            start.x + c.y * grid.width,
            start.y + c.x * grid.height,
            grid.width - lineWidth,
            grid.height - lineWidth,
            {
                name: c.n.toString(),
                type: RectType.CELL,
                board: board,
                option: RectOption.cell,
                borderWidth: lineWidth,
                borderColor: Color.FULLBLACK,
                background: c.color,
            }))
            .draw()
        ;
        zones.push(rect);
    }
}


function drawOptions(vp:ViewPort) {
    const { board } = vp;

    type Cords = {x:number, y:number, w:number, h:number, b?:Color, t?:RectType, o:RectOption};
    const options: {[key: string]: Cords} = {
        '0': {o:RectOption.cell, x: 0, y: 0, w:grid.width, h:grid.height*3, b:Color.GREEN, t:RectType.CELL},
        '1st12': {o: RectOption["1st12"], x: grid.width, y: grid.height*3, w:grid.width*4, h:50},
        '2st12': {o: RectOption["2st12"], x: grid.width*5, y: grid.height*3, w:grid.width*4, h:50},
        '3st12': {o: RectOption["3st12"], x: grid.width*9, y: grid.height*3, w:grid.width*4, h:50},
        '1>18': {o: RectOption["1>18"], x: grid.width, y: grid.height*4-20, w:grid.width*6, h:50},
        '19>36': {o: RectOption["19>36"], x: grid.width*7, y: grid.height*4-20, w:grid.width*6, h:50},
        '1_line': {o: RectOption["1_line"], x: grid.width*13, y: 0, w:grid.width*2, h:grid.height},
        '2_line': {o: RectOption["2_line"], x: grid.width*13, y: grid.height, w:grid.width*2, h:grid.height},
        '3_line': {o: RectOption["3_line"], x: grid.width*13, y: grid.height*2, w:grid.width*2, h:grid.height},
        'even': {o: RectOption.even, x: grid.width, y: grid.height*4+30, w:grid.width*3, h:grid.height-20},
        'odd': {o: RectOption.odd, x: grid.width*4, y: grid.height*4+30, w:grid.width*3, h:grid.height-20},
        'red': {o: RectOption.red, x: grid.width*7, y: grid.height*4+30, w:grid.width*3, h:grid.height-20, b:Color.RED},
        'black': {o: RectOption.black, x: grid.width*10, y: grid.height*4+30, w:grid.width*3, h:grid.height-20, b:Color.BLACK},
        'ROLL': {o:RectOption.button, x: grid.width, y: grid.height*6, w:grid.width*3, h:grid.height, b:Color.ORANGE, t:RectType.ROLL},
    };

    for(const oName of Object.keys(options)) {
        const { x, y, w, h, b, t, o } = options[oName];
        const background: Color = b != undefined ? b : Color.GREEN;
        const rect = (new Rect(
            start.x+x,
            start.y+y,
            w,
            h,
            {
                name: oName,
                type: !t ? RectType.OPTION : t,
                option: o,
                board: board,
                borderWidth: lineWidth,
                borderColor: Color.FULLBLACK,
                background: background,
            }))
            .draw();
        ;
        zones.push(rect);
    }

}




function drawBid(vp:ViewPort, bid:Bid) {
    const { ui:{ctx},ui } = vp;
    const { rect:{w,h},rect } = bid

    const radius = 18;
    const bidMargin = 10;
    const x = rect.x - bidMargin;
    const y = rect.y - bidMargin;
    ctx.beginPath();
        ctx.fillStyle = Color.BID;
        ctx.beginPath();
        ctx.arc(x+w, y+h, radius, 0, 2 * Math.PI);
        ctx.fill();
    ctx.closePath();


    const irect = new Rect(
        x+w-radius,
        y+h-radius+1,
        radius*2,
        radius*2,
        {
            name: bid.amount.toString(),
            type: RectType.CELL,
            option: RectOption.cell,
        })
        .drawText(ui, 14)
    ;
};

// function ddrawBid(vp:ViewPort, bid:Bid) {
//     const { ui:{ctx},ui } = vp;
//     const { rect:{w,h},rect } = bid

//     const radius = 20;
//     const bidMargin = 10;
//     const x = rect.x - bidMargin;
//     const y = rect.y - bidMargin;
//     ctx.beginPath();
//         ctx.fillStyle = Color.BID;
//         ctx.beginPath();
//         ctx.arc(x+w, y+h, radius, 0, 2 * Math.PI);
//         ctx.fill();
//     ctx.closePath();


//     const irect = new Rect(bid.amount.toString(), RectType.CELL, x+w-radius, y+h-radius+1, radius*2, radius*2)
//         .drawTextOn(ui, 14)
//     ;
// };

function drawCont(vp:ViewPort) {
    const {rect:r} = cont;
    const {ui} = vp;
    const rect = (new Rect(r.x,r.y,r.w,r.h,{
        name: cont.value.toString(),
        type: r.param.type,
        option: RectOption.cell,
        board: ui,
        background: r.param.background,
        borderColor: r.param.borderColor,
        borderWidth: r.param.borderWidth,
    }));
    rect.draw();
}

function init() {
    const vp = new ViewPort();
    const { board:{ctx}, ui } = vp;
    ctx.fillStyle = Color.DARKGREEN;
    ctx.fillRect(0, 0, vp.size.width, vp.size.height);
    drawCells(vp);
    drawOptions(vp);
    vp.copy();
    
    drawCont(vp);
    // faceBid
    // const rect = new Rect('0.5',RectType.OPTION, 600, 400, 50, 50);
    // drawBid(vp, {rect:rect, amount: 0.5});

    const injectViewPort = function(event:PointerEvent) {
        return click(vp, event);
    };

    ui.canvas.addEventListener("click", injectViewPort);




    // test font
    // type Test = {x:number,y:number,w:number,h:number,t:string,s:number};
    // const test:Test[] = [
    //     {x: 100, y:100, w:200, h:40, t:'subzero', s:36},
    //     {x: 320, y:100, w:110, h:34, t:'MMMMM', s:36},
    //     {x: 100, y:150, w:84, h:40, t:'gfbp',s:36},
    //     {x: 100, y:200, w:100, h:300, t:'TRIN',s:36},
    //     {x: 220, y:200, w:600, h:300, t:'DETS',s:256},
    // ];

    // for(const p of test) {
    //     const rect = (new Rect(p.x, p.y, p.w, p.h)).setName(p.t)
    //     .setStyle({
    //         borderWidth: lineWidth,
    //         borderColor: 'white',
    //         background: 'black',
    //     });
    //     drawRect(board, rect);
    //     drawText(board, rect, p.s);
    // }
}


function click(vp:ViewPort, event:PointerEvent) {
    const {clientX:x, clientY:y} = event;
    const rect:Rect|null = getClickedRect(x, y);
    if(rect === null) {
        console.info(`no one rect was clicked`);
        return;
    }
    const clear = function () {
        if (cleanStart){
            cleanStart = false;
            vp.copy();
            drawCont(vp);
        }
    }
    switch(rect.param.type) {
        case RectType.ROLL:
            clear();
            Roll(vp);
            break;
        case RectType.CELL:
        case RectType.OPTION: {
            clear();
            const bid: Bid = addBid({rect:rect, amount: 100});
            if(bid) {
                drawBid(vp, bid);
                drawCont(vp);
            }
            break;
        };
        default: {
            console.warn(`click on type: "${rect.param.type}" & name: ${rect.param.name} is not privided`);
            break;
        }
    }
}

window.addEventListener('load', function() {
  init();
  console.log({zones})
});

function getClickedRect(x:number, y:number):Rect|null {
    for(const rect of zones) {
        if(rect.x < x && x < rect.x+rect.w  && rect.y < y && y < rect.y+rect.h) {
            return rect;
        }
    }
    return null;
}


function Roll(vp:ViewPort) {
    const { ui } = vp;
    const ball: number = Math.floor(Math.random() * 37);
    const originalRect: Rect = zones.find(e=>(e.param.type===RectType.CELL && e.param.name===ball.toString()));
    originalRect
        .clone({borderColor:Color.YELLOW, background:null})
        .drawRect(ui)
    ;
    console.log(`BALL: ${ball}`);
    let income = 0;
    let outcome = 0;
    if(Object.keys(bids).length) {
        for(const bid of Object.values(bids)) {
            outcome += bid.amount;
            const multiplier = BidMultiplier(bid, ball);
            if(multiplier) {
                const winnerBid:WinnerBid = {rect:bid.rect, amount:bid.amount, multiplier:multiplier, sum: bid.amount * multiplier};
                winnerBids.push(winnerBid);
                income += winnerBid.sum;
                console.log(`order: ${bid.rect.param.name}, amount: ${bid.amount} * ${multiplier}, pureIncome: ${bid.amount * multiplier - bid.amount}`);
            }
        }
    }
    console.log(`WIN: ${income}, SPEND: ${outcome}, step: ${income-outcome}`);
    cont.value += income;
    drawCont(vp);
    // clear bids
    bids = {};
    winnerBids = [];
    // clear drawer
    cleanStart = true;

}

enum BidTypeEnum {
    '1st12' = '1st12',
    '2st12' = '2st12',
    '3st12' = '3st12',
    '1>18' = '1>18',
    '19>36' = '19>36',
    '1_line' = '1_line',
    '2_line' = '2_line',
    '3_line' = '3_line',
    'even' = 'even',
    'odd' = 'odd',
    'red' = 'red',
    'black' = 'black',
    'cell' = 'cell',
}
interface Bid {
    rect: Rect,
    amount: number,
}
interface WinnerBid {
    rect: Rect,
    amount: number,
    multiplier: number,
    sum: number,
}
// let bids:Bid[] = [];
let bids: {[key: string]: Bid} = {};
function addBid(bid:Bid):Bid {
    const key = `${bid.rect.param.name}.${bid.rect.x}.${bid.rect.y}`;
    const keys = Object.keys(bids);
    if (cont.value >= bid.amount) {
        cont.value -= bid.amount;
    } else {
        return null;
    }
    if(keys.includes(key)) {
        bid.amount += bids[key].amount;
        bids[key] = bid;
    } else {
        bids[key] = bid;
    }

    return bid;
}
let winnerBids:WinnerBid[] = []



// type BidName = '1st12' | '2st12' | '3st12' | '1>18' | '19>36' | '1_line' | '2_line' | '3_line' | 'even' | 'odd' | 'red' | 'black' | 'cell';


function BidMultiplier(bid:Bid, ball:number):number {
    const ballString = ball.toString()
    const { rect:{ param:{name:bidName} } } =  bid;

    const cell:Rect = zones.find(z=>z.param.name===ballString);
    const {name:ballName} = cell.param;

    // console.log(`bidName: ${bidName} || ballName: ${ballName}`);

    if(bid.rect.param.type === RectType.CELL) {
        if(bidName === ballName) {
            return 36;
        }else {
            return 0;
        }
    } 

    switch(bid.rect.param.name) {
        // case : {
        //     if(rect.name === cell.name) {
        //         return 36;
        //     }
        // };
        case 'odd':
            if(ball !== 0 && ball%2===1) {
                return 2;
            }
        break;
        case 'even':
            if(ball !== 0 && ball%2===0) {
                return 2;
            }
        break;
        case 'red':
            if(cell.param.background === Color.RED) {
                return 2;
            }
        break;
        case 'black':
            if(cell.param.background === Color.BLACK) {
                return 2;
            }
        break;
        case '1_line':
            if(ball%3 === 0) {
                return 3;
            }
        break;
        case '2_line':
            if(ball%3 === 2) {
                return 3;
            }
        break;
        case '3_line':
            if(ball%3 === 1) {
                return 3;
            }
        break;
        case '1st12':
            if(1 <= ball && ball <= 12 ) {
                return 3;
            }
        break;
        case '2st12':
            if(13 <= ball && ball <= 24 ) {
                return 3;
            }
        break;
        case '3st12':
            if(25 <= ball && ball <= 36 ) {
                return 3;
            }
        break;
        case '1>18':
            if(1 <= ball && ball <= 18 ) {
                return 2;
            }
        break;
        case '19>36':
            if(19 <= ball && ball <= 36 ) {
                return 2;
            }
        break;

        default:{
            throw new Error(`Can't find option for bid name: "${bid.rect.param.name}" type: ${bid.rect.param.type}`);
            break;
        };
    };
    return 0;
}