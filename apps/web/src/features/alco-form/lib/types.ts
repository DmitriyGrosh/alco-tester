export type AlcoholType =
    | 'Absent'
    | 'Beer'
    | 'Wine'
    | 'Vodka'
    | 'Whiskey'
    | 'Rum'
    | 'Tequila'
    | 'Gin'
    | 'Champagne'
    | 'Brandy'
    | 'Other';

export type TypeOfBottle =
    | 'Bottle'
    | 'Pint'
    | 'Glass'
    | 'Shot'
    | 'Other';

export type BottleMilliliterValue = 330 | 500 | 750 | 1000;
export type PintMilliliterValue = 330 | 500 | 568;
export type GlassMilliliterValue = 100 | 150 | 200 | 250;
export type ShotMilliliterValue = 25 | 30 | 44 | 50 | 100;
export type OtherMilliliterValue = 0;

export type BottleTypeMlMap = {
    readonly 'Bottle': readonly BottleMilliliterValue[];
    readonly 'Pint': readonly PintMilliliterValue[];
    readonly 'Glass': readonly GlassMilliliterValue[];
    readonly 'Shot': readonly ShotMilliliterValue[];
    readonly 'Other': readonly OtherMilliliterValue[];
};

export type AlcoholBottleTypeMap = {
    readonly [K in AlcoholType]: readonly TypeOfBottle[];
};

export type SizeOfBottle = 
    | BottleMilliliterValue 
    | PintMilliliterValue 
    | GlassMilliliterValue 
    | ShotMilliliterValue 
    | OtherMilliliterValue;