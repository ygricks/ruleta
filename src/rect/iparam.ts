import { BidColor, Color } from '../color';
import { ICanvas } from '../viewport';

export interface IParam {
    name: string;
    background?: Color | BidColor;
    borderColor?: Color | BidColor;
    borderWidth?: number;
    board?: ICanvas;
    fontSize?: number;
}
