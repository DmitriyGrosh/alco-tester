import { reatomForm, reatomField } from "@reatom/core";
import { z } from "zod";
import { type Dayjs } from "dayjs";
import { alcoFormListAtom } from "../../../entities/alcohol/model";
import { calculateWidmark } from "../lib";

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

      const data = calculateWidmark(drinks, state.weight, state.gender, state.start, state.end);

      console.log("data", data);
    },
  }
);

