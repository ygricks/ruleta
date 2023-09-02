import { RectOption } from '.';
import { BidColor, Color } from '../color';
import { ICanvas } from '../viewport';

export interface IParam {
    name: string;
    option: RectOption;
    background?: Color | BidColor;
    borderColor?: Color | BidColor;
    borderWidth?: number;
    board?: ICanvas;
    fontSize?: number;
}
