import { Figure } from './figure';

// common Figure Profile
export type FigureProfile = { x: number; y: number; w: number; h: number };

export type ProfileTuble = [number, number, number, number];

export const ProfileEnumerate = function (p: FigureProfile): ProfileTuble {
    return [p.x, p.y, p.w, p.h];
};

// common shape
export type Shape = { w: number; h: number };

// common figure profile
export type Profile = { [key in Figure]: FigureProfile };
