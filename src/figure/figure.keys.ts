import { Figure } from './figure';

type FigureKeysProfile = { [key in Figure]: string };

export const FigureKeys: FigureKeysProfile = (function () {
    let data: Partial<FigureKeysProfile> = {};
    const keys = Object.keys(Figure);

    keys.forEach((key) => {
        const figure = GetFigureByKey(key);
        data[figure] = key.toString();
    });
    return data as FigureKeysProfile;
})();

export function GetFigureByKey(key: string): Figure {
    return Figure[key as keyof typeof Figure];
}

export function GetFigureByValue(value: string): Figure {
    const index = Object.values(Figure).indexOf(value as unknown as Figure);

    const key = Object.keys(Figure)[index];
    return GetFigureByKey(key);
}
