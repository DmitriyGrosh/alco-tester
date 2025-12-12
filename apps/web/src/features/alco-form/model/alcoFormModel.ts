import { reatomEnum, reatomField, reatomForm, withField } from "@reatom/core";
import { z } from "zod";
import { ALCOHOL_BOTTLE_TYPE_MAP, ALCOHOL_PERCENTAGE_MAP, ALCOHOLS, BOTTLE_SIZE_ML_MAP, TYPE_OF_BOTTLE, type SizeOfBottle } from "../lib";

export const alcoFormAtom = reatomForm(
    {
        name: reatomEnum(ALCOHOLS, { initState: 'Beer' }).extend(withField()),
        percentage: reatomField(ALCOHOL_PERCENTAGE_MAP['Beer']),
        typeOfBottle: reatomEnum(TYPE_OF_BOTTLE, { initState: ALCOHOL_BOTTLE_TYPE_MAP['Beer'][0] }).extend(withField()),
        sizeOfBottle: reatomField(BOTTLE_SIZE_ML_MAP['Bottle'][0] as SizeOfBottle),
        count: 1,
    },
    {
        validateOnBlur: true,
        schema: z.object({
            name: z.literal(ALCOHOLS),
            percentage: z.number(),
            typeOfBottle: z.literal(TYPE_OF_BOTTLE),
            count: z.number().min(0),
        })
    }
)

alcoFormAtom.fields.name.subscribe((value) => {
    alcoFormAtom.fields.percentage.set(ALCOHOL_PERCENTAGE_MAP[value]);
    alcoFormAtom.fields.typeOfBottle.set(ALCOHOL_BOTTLE_TYPE_MAP[value][0]);
});

alcoFormAtom.fields.typeOfBottle.subscribe((value) => {
    alcoFormAtom.fields.sizeOfBottle.set(BOTTLE_SIZE_ML_MAP[value][0] as SizeOfBottle);
});
