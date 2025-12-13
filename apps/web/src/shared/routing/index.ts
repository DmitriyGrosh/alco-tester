import { reatomRoute } from "@reatom/core";
import { z } from "zod";

export const homeRoute = reatomRoute("");

export const allDrinksRoute = reatomRoute({
  path: "all-drinks",
  search: z.object({
    drawer: z.enum(["show", "hide"]).optional(),
  }),
});

export const timelineDrinksRoute = reatomRoute({
  path: "timeline-drinks",
  search: z.object({
    drawer: z.enum(["show", "hide"]).optional(),
  }),
});
