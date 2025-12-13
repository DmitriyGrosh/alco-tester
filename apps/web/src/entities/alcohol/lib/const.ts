import type {
  AlcoholType,
  TypeOfBottle,
  BottleMilliliterValue,
  PintMilliliterValue,
  GlassMilliliterValue,
  ShotMilliliterValue,
  OtherMilliliterValue,
  BottleTypeMlMap,
  AlcoholBottleTypeMap,
} from "./types";

export const ALCOHOLS = [
  "Absent",
  "Beer",
  "Wine",
  "Vodka",
  "Whiskey",
  "Rum",
  "Tequila",
  "Gin",
  "Champagne",
  "Brandy",
  "Other",
] as const satisfies AlcoholType[];

export const TYPE_OF_BOTTLE = [
  "Bottle",
  "Pint",
  "Glass",
  "Shot",
  "Other",
] as const satisfies TypeOfBottle[];

export const BOTTLE_SIZE_ML_MAP = {
  Bottle: [330, 500, 750, 1000] as const satisfies BottleMilliliterValue[],
  Pint: [330, 500, 568] as const satisfies PintMilliliterValue[],
  Glass: [100, 150, 200, 250] as const satisfies GlassMilliliterValue[],
  Shot: [25, 30, 44, 50, 100] as const satisfies ShotMilliliterValue[],
  Other: [0] as const satisfies OtherMilliliterValue[],
} as const satisfies BottleTypeMlMap;

export const ALCOHOL_PERCENTAGE_MAP: Record<AlcoholType, number> = {
  Absent: 50,
  Beer: 5,
  Wine: 12,
  Vodka: 40,
  Whiskey: 40,
  Rum: 40,
  Tequila: 40,
  Gin: 40,
  Champagne: 12,
  Brandy: 40,
  Other: 0,
};

export const ALCOHOL_BOTTLE_TYPE_MAP = {
  Absent: ["Other"] as const satisfies readonly TypeOfBottle[],
  Beer: ["Pint", "Bottle", "Glass"] as const satisfies readonly TypeOfBottle[],
  Wine: ["Bottle", "Glass"] as const satisfies readonly TypeOfBottle[],
  Vodka: ["Bottle", "Shot", "Glass"] as const satisfies readonly TypeOfBottle[],
  Whiskey: [
    "Bottle",
    "Shot",
    "Glass",
  ] as const satisfies readonly TypeOfBottle[],
  Rum: ["Bottle", "Shot", "Glass"] as const satisfies readonly TypeOfBottle[],
  Tequila: [
    "Bottle",
    "Shot",
    "Glass",
  ] as const satisfies readonly TypeOfBottle[],
  Gin: ["Bottle", "Shot", "Glass"] as const satisfies readonly TypeOfBottle[],
  Champagne: ["Bottle", "Glass"] as const satisfies readonly TypeOfBottle[],
  Brandy: [
    "Bottle",
    "Shot",
    "Glass",
  ] as const satisfies readonly TypeOfBottle[],
  Other: ["Other"] as const satisfies readonly TypeOfBottle[],
} as const satisfies AlcoholBottleTypeMap;
