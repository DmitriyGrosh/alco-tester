import { timelineFormAtom } from "./timelineFormModel";
import {
  ALCOHOL_BOTTLE_TYPE_MAP,
  ALCOHOL_PERCENTAGE_MAP,
  ALCOHOLS,
  BOTTLE_SIZE_ML_MAP,
} from "../../../entities/alcohol";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { adeResultAtom } from "./timelineFormModel";

export const useBehavior = () => {
  const { t } = useTranslation();
  const { fields, submit } = timelineFormAtom;
  const drinks = fields.drinks.array();
  const drinksSidebar = drinks.map((drink) => ({
    name: drink.name.value(),
    percentage: drink.percentage.value(),
    typeOfBottle: drink.typeOfBottle.value(),
    sizeOfBottle: drink.sizeOfBottle.value(),
    count: drink.count.value(),
    breakTime: null,
  }));

  const onAddDrink = () => {
    fields.drinks.create({
      name: "Beer",
      percentage: ALCOHOL_PERCENTAGE_MAP["Beer"],
      typeOfBottle: ALCOHOL_BOTTLE_TYPE_MAP["Beer"][0],
      sizeOfBottle: BOTTLE_SIZE_ML_MAP["Bottle"][0],
      count: 1,
      time: null,
      id: crypto.randomUUID(),
    });
  };

  const onRemoveDrink = (index: number) => {
    const drinks = fields.drinks.array();
    if (drinks[index]) {
      fields.drinks.remove(drinks[index]);
    }
  };

  const columns = [
    {
      title: t("common.time"),
      dataIndex: "date",
      key: "date",
      render: (date: dayjs.Dayjs) => date.format("HH:mm"),
    },
    {
      title: "Permille (‰)",
      dataIndex: "permille",
      key: "permille",
      render: (val: number) => val.toFixed(3),
    },
  ];

  const alcoOptions = useMemo(
    () =>
      ALCOHOLS.map((alcohol) => ({
        value: alcohol,
        label: t(`alcoForm.options.alco.${alcohol}`),
      })),
    [t],
  );

  return {
    onAddDrink,
    onRemoveDrink,
    fields,
    columns,
    alcoOptions,
    drinksSidebar,
    submit,
    adeResult: adeResultAtom,
  };
};
