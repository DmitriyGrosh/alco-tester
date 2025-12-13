import { atom, computed, experimental_fieldArray, reatomEnum, reatomField, reatomForm, withField, reatomArray } from "@reatom/core";
import { z } from "zod";
import { ALCOHOL_BOTTLE_TYPE_MAP, ALCOHOL_PERCENTAGE_MAP, ALCOHOLS, BOTTLE_SIZE_ML_MAP, TYPE_OF_BOTTLE, type SizeOfBottle } from "../lib";

export const drinksAtom = atom([]);
