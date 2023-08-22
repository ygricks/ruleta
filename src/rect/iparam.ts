import { RectOption, RectType } from ".";
import { Color } from "../color";
import { ICanvas } from "../viewport";

export interface IParam {
    name: string,
    type: RectType,
    option: RectOption,
    background?: Color,
    borderColor?: Color,
    borderWidth?: number,
    board?: ICanvas,
}