import { Color } from '../color';
import { ICanvas } from '../viewport';

export interface IParam {
    name: string;
    background?: Color;
    borderColor?: Color;
    borderWidth?: number;
    board?: ICanvas;
    fontSize?: number;
}
