import { experimental_fieldArray, reatomField, reatomForm, throwAbort, withComputed } from "@reatom/core";
import { z } from "zod";
import { ALCOHOL_BOTTLE_TYPE_MAP, ALCOHOL_PERCENTAGE_MAP, ALCOHOLS, BOTTLE_SIZE_ML_MAP, TYPE_OF_BOTTLE, type AlcoholType, type SizeOfBottle, type TypeOfBottle } from "../lib";

export const alcoFormListAtom = reatomForm(
    {
        drinks: experimental_fieldArray({
            initState: [{
                name: "Beer" as AlcoholType,
                percentage: ALCOHOL_PERCENTAGE_MAP['Beer'],
                typeOfBottle: ALCOHOL_BOTTLE_TYPE_MAP['Beer'][0] as TypeOfBottle,
                sizeOfBottle: BOTTLE_SIZE_ML_MAP['Bottle'][0] as SizeOfBottle,
                count: 1,
            }],
            create: ({ name, percentage, typeOfBottle, sizeOfBottle, count }, groupName) => {
                const nameField = reatomField(name, `${groupName}.name`);
                const percentageField = reatomField(percentage, {
                    name: `${groupName}.percentage`,
                    fromState: (state) => state.toString(),
                    toState: (value: string) => {
                      const parsed = Number(value)
                      return isNaN(parsed) ? throwAbort() : parsed
                    }
                }).extend(withComputed(() => ALCOHOL_PERCENTAGE_MAP[nameField.value()]));
                const typeOfBottleField = reatomField(typeOfBottle, `${groupName}.typeOfBottle`).extend(withComputed(() => ALCOHOL_BOTTLE_TYPE_MAP[nameField.value()][0]));
                const sizeOfBottleField = reatomField(sizeOfBottle, `${groupName}.sizeOfBottle`).extend(withComputed(() => BOTTLE_SIZE_ML_MAP[typeOfBottleField.value()][0]));
                const countField = reatomField(count, {
                    name: `${groupName}.count`,
                    fromState: (state) => {
                        console.log("state", state)
                        return state.toString()
                    },
                    toState: (value: string) => {
                      const parsed = Number(value)
                      console.log("parsed", parsed)
                      return isNaN(parsed) ? throwAbort() : parsed
                    }
                });

                return { name: nameField, percentage: percentageField, typeOfBottle: typeOfBottleField, sizeOfBottle: sizeOfBottleField, count: countField };
            }
        })
    },
    {
        validateOnBlur: true,
        schema: z.array(
            z.object({
                name: z.literal(ALCOHOLS),
                percentage: z.number(),
                typeOfBottle: z.literal(TYPE_OF_BOTTLE),
                count: z.number().min(1),
            })
        )
    }
)
