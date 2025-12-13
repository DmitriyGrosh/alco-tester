import {
  ALCOHOL_BOTTLE_TYPE_MAP,
  ALCOHOL_PERCENTAGE_MAP,
  ALCOHOLS,
  BOTTLE_SIZE_ML_MAP,
  type AlcoholType,
} from "../lib";
import { alcoFormListAtom } from "./alcoFormModel";
import { useTranslation } from "react-i18next";
import { type FormEvent, useMemo, useCallback } from "react";

export const useBehavior = () => {
  const { t } = useTranslation();
  const { fields: drinksFields, submit } = alcoFormListAtom;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit();
  };

  const onAddDrink = () => {
    drinksFields.drinks.create({
      name: "Beer",
      percentage: ALCOHOL_PERCENTAGE_MAP["Beer"],
      typeOfBottle: ALCOHOL_BOTTLE_TYPE_MAP["Beer"][0],
      sizeOfBottle: BOTTLE_SIZE_ML_MAP["Bottle"][0],
      count: 1,
    });
  };

  const alcoOptions = useMemo(
    () =>
      ALCOHOLS.map((alcohol) => ({
        value: alcohol,
        label: t(`alcoForm.options.alco.${alcohol}`),
      })),
    [t],
  );

  const getBottleTypeOptions = useCallback(
    (alcoName: AlcoholType) => {
      return ALCOHOL_BOTTLE_TYPE_MAP[alcoName].map((bottle) => ({
        value: bottle,
        label: t(`alcoForm.options.bottleType.${bottle}`),
      }));
    },
    [t],
  );

  const getBottleSizeOptions = useCallback(
    (typeOfBottle: keyof typeof BOTTLE_SIZE_ML_MAP) => {
      return BOTTLE_SIZE_ML_MAP[typeOfBottle].map((size) => ({
        value: size,
        label: `${size} ${t("units.ml")}`,
      }));
    },
    [t],
  );

  return {
    onSubmit,
    onAddDrink,
    alcoOptions,
    getBottleTypeOptions,
    getBottleSizeOptions,
  };
};
