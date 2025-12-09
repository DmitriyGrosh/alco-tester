import { reatomForm, experimental_fieldArray } from "@reatom/core";
import { z } from "zod";

const drinkSchema = z.object({
    alcoName: z.string().min(0),
    alcoPercentage: z.number().min(0).max(100),
    alcoGrams: z.number().min(0),
});

const alcoFormSchema = z.array(drinkSchema);

export const alcoFormAtom = reatomForm({
    drinks: experimental_fieldArray({
        initState: [{alcoName: '', alcoPercentage: 0, alcoGrams: 0}],
        create: (params: z.infer<typeof drinkSchema>) => {
            return drinkSchema.parse(params);
        },
    })
}, {
    name: 'alcoForm',
    schema: alcoFormSchema,
    async onSubmit(state) {
        console.log("state", state);
    }
})