import {
  ALCOHOL_BOTTLE_TYPE_MAP,
  ALCOHOLS,
  BOTTLE_SIZE_ML_MAP,
  type AlcoholType,
} from "../lib";
import { useTranslation } from "react-i18next";
import { useMemo, useCallback } from "react";

export const useBehavior = () => {
  const { t } = useTranslation();

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
    alcoOptions,
    getBottleTypeOptions,
    getBottleSizeOptions,
  };
};
