import { RectOption } from '.';
import { Color } from '../color';
import { ICanvas } from '../viewport';

export interface IParam {
    name: string;
    option: RectOption;
    background?: Color;
    borderColor?: Color;
    borderWidth?: number;
    board?: ICanvas;
}
