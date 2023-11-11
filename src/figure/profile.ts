import { Figure } from './figure';

// common shape
export type Shape = { w: number; h: number };

// common Figure Profile
export type FigureProfile = { x: number; y: number; w: number; h: number };

// common figure profile
export type Profile = { [key in Figure]: FigureProfile };
