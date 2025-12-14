import {
  ALCOHOL_BOTTLE_TYPE_MAP,
  ALCOHOL_PERCENTAGE_MAP,
  BOTTLE_SIZE_ML_MAP,
} from "../../../entities/alcohol";
import { alcoFormListAtom, durationFormAtom } from "./durationFormModel";

export const useBehavior = () => {
  const { fields: drinksFields } = alcoFormListAtom;
  const { fields: durationFields, submit } = durationFormAtom;

  const drinks = drinksFields.drinks.array();
  const drinksSidebar = drinks.map((drink) => ({
    name: drink.name.value(),
    percentage: drink.percentage.value(),
    typeOfBottle: drink.typeOfBottle.value(),
    sizeOfBottle: drink.sizeOfBottle.value(),
    count: drink.count.value(),
    breakTime: drink.breakTime.value(),
  }));

  const onAddDrink = () => {
    drinksFields.drinks.create({
      name: "Beer",
      percentage: ALCOHOL_PERCENTAGE_MAP["Beer"],
      typeOfBottle: ALCOHOL_BOTTLE_TYPE_MAP["Beer"][0],
      sizeOfBottle: BOTTLE_SIZE_ML_MAP["Bottle"][0],
      count: 1,
      breakTime: null,
    });
  };

  const onRemoveDrink = (index: number) => {
    const drinks = drinksFields.drinks.array();
    if (drinks[index]) {
      drinksFields.drinks.remove(drinks[index]);
    }
  };

  return {
    onAddDrink,
    onRemoveDrink,
    drinksSidebar,
    drinks,
    durationFields,
    submit,
  };
};
