import {
  reatomForm,
  reatomField,
  experimental_fieldArray,
  throwAbort,
  withComputed,
} from "@reatom/core";
import { z } from "zod";
import { type Dayjs } from "dayjs";
import { calculateWidmark } from "../lib";
import {
  type AlcoholType,
  ALCOHOL_PERCENTAGE_MAP,
  ALCOHOL_BOTTLE_TYPE_MAP,
  type TypeOfBottle,
  BOTTLE_SIZE_ML_MAP,
  type SizeOfBottle,
  ALCOHOLS,
  TYPE_OF_BOTTLE,
} from "../../../entities/alcohol";

export const alcoFormListAtom = reatomForm(
  {
    drinks: experimental_fieldArray({
      initState: [
        {
          name: "Beer" as AlcoholType,
          percentage: ALCOHOL_PERCENTAGE_MAP["Beer"],
          typeOfBottle: ALCOHOL_BOTTLE_TYPE_MAP["Beer"][0] as TypeOfBottle,
          sizeOfBottle: BOTTLE_SIZE_ML_MAP["Bottle"][0] as SizeOfBottle,
          count: 1,
          breakTime: null as string | null,
        },
      ],
      create: (
        { name, percentage, typeOfBottle, sizeOfBottle, count, breakTime },
        groupName,
      ) => {
        const nameField = reatomField(name, `${groupName}.name`);
        const percentageField = reatomField(percentage, {
          name: `${groupName}.percentage`,
          fromState: (state) => state.toString(),
          toState: (value: string) => {
            const parsed = Number(value);
            return isNaN(parsed) ? throwAbort() : parsed;
          },
        }).extend(
          withComputed(() => ALCOHOL_PERCENTAGE_MAP[nameField.value()]),
        );
        const typeOfBottleField = reatomField(
          typeOfBottle,
          `${groupName}.typeOfBottle`,
        ).extend(
          withComputed(() => ALCOHOL_BOTTLE_TYPE_MAP[nameField.value()][0]),
        );
        const sizeOfBottleField = reatomField(
          sizeOfBottle,
          `${groupName}.sizeOfBottle`,
        ).extend(
          withComputed(() => BOTTLE_SIZE_ML_MAP[typeOfBottleField.value()][0]),
        );
        const countField = reatomField(count, {
          name: `${groupName}.count`,
          fromState: (state) => {
            console.log("state", state);
            return state.toString();
          },
          toState: (value: string) => {
            const parsed = Number(value);
            console.log("parsed", parsed);
            return isNaN(parsed) ? throwAbort() : parsed;
          },
        });

        const breakTimeField = reatomField(breakTime, `${groupName}.breakTime`);

        return {
          name: nameField,
          percentage: percentageField,
          typeOfBottle: typeOfBottleField,
          sizeOfBottle: sizeOfBottleField,
          count: countField,
          breakTime: breakTimeField,
        };
      },
    }),
  },
  {
    validateOnBlur: true,
    schema: z.object({
      drinks: z.array(
        z.object({
          name: z.literal(ALCOHOLS),
          percentage: z.number().min(0),
          typeOfBottle: z.literal(TYPE_OF_BOTTLE),
          sizeOfBottle: z.number().min(1),
          count: z.number().min(1),
          breakTime: z.string().nullable().optional(),
        }),
      ),
    }),
  },
);

export const durationFormAtom = reatomForm(
  {
    start: reatomField<Dayjs | null>(null, "start"),
    end: reatomField<Dayjs | null>(null, "end"),
    weight: reatomField<number | null>(null, "weight"),
    gender: reatomField<"male" | "female" | null>(null, "gender"),
    age: reatomField<number | null>(null, "age"),
  },
  {
    name: "durationFormAtom",
    validateOnBlur: true,
    schema: z.object({
      start: z.any(),
      end: z.any(),
      weight: z.number().min(30).max(300),
      gender: z.enum(["male", "female"]),
      age: z.number().min(18).max(100),
    }),
    onSubmit(state) {
      const drinks = alcoFormListAtom.fields.drinks.array().map((drink) => ({
        count: Number(drink.count.value()),
        volume: Number(drink.sizeOfBottle.value()),
        percentage: Number(drink.percentage.value()),
      }));

      const data = calculateWidmark(
        drinks,
        state.weight,
        state.gender,
        state.start,
        state.end,
      );

      console.log("data", data);
    },
  },
);
