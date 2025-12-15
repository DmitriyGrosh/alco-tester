import {
  reatomForm,
  reatomField,
  experimental_fieldArray,
  withComputed,
  throwAbort,
  // computed,
  atom,
} from "@reatom/core";
import { z } from "zod";
// import dayjs, { Dayjs } from "dayjs";
import { calculateAde, type TimelineDrink, type AdePoint } from "../lib";
import {
  ALCOHOL_BOTTLE_TYPE_MAP,
  ALCOHOL_PERCENTAGE_MAP,
  ALCOHOLS,
  BOTTLE_SIZE_ML_MAP,
  TYPE_OF_BOTTLE,
  type AlcoholType,
  type SizeOfBottle,
  type TypeOfBottle,
} from "../../../entities/alcohol";
import dayjs, { Dayjs } from "dayjs";

export const adeResultAtom = atom<AdePoint[]>([], "adeResultAtom");

export const timelineFormAtom = reatomForm(
  {
    weight: reatomField(70, {
      name: "weight",
      fromState: (state) => state.toString(),
      toState: (value: string) => {
        const parsed = Number(value);
        return isNaN(parsed) ? throwAbort() : parsed;
      },
    }),
    height: reatomField(170, {
      name: "height",
      fromState: (state) => state.toString(),
      toState: (value: string) => {
        const parsed = Number(value);
        return isNaN(parsed) ? throwAbort() : parsed;
      },
    }),
    gender: reatomField<"male" | "female">("male", "gender"),
    drinks: experimental_fieldArray({
      initState: [
        {
          name: "Beer" as AlcoholType,
          percentage: ALCOHOL_PERCENTAGE_MAP["Beer"],
          typeOfBottle: ALCOHOL_BOTTLE_TYPE_MAP["Beer"][0] as TypeOfBottle,
          sizeOfBottle: BOTTLE_SIZE_ML_MAP["Bottle"][0] as SizeOfBottle,
          count: 1,
          time: null,
          id: crypto.randomUUID(),
        },
      ],
      create: (
        { name, percentage, typeOfBottle, sizeOfBottle, count, time, id },
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

        return {
          name: nameField,
          percentage: percentageField,
          typeOfBottle: typeOfBottleField,
          sizeOfBottle: sizeOfBottleField,
          count: countField,
          time,
          id,
        };
      },
    }),
  },
  {
    name: "timelineFormAtom",
    validateOnBlur: true,
    schema: z.object({
      weight: z.number().min(30).max(300),
      height: z.number().min(100).max(250),
      gender: z.enum(["male", "female"]),
      drinks: z.array(
        z.object({
          name: z.literal(ALCOHOLS),
          percentage: z.number().min(0),
          typeOfBottle: z.literal(TYPE_OF_BOTTLE),
          sizeOfBottle: z.number().min(1),
          count: z.number().min(1),
          time: z.instanceof(dayjs as unknown as typeof Dayjs),
          id: z.string(),
        }),
      ), // Simplified validation for now
    }),
    onSubmit(state) {
      const drinks: TimelineDrink[] = state.drinks.map((d) => ({
        id: d.id,
        volume: d.sizeOfBottle * d.count,
        percentage: d.percentage,
        time: d.time,
      }));

      const data = calculateAde(drinks, {
        weight: state.weight,
        gender: state.gender,
      });
      adeResultAtom.set(data);
      console.log("state", data);
    },
  },
);
