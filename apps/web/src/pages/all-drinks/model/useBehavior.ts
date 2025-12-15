import {
  ALCOHOL_BOTTLE_TYPE_MAP,
  ALCOHOL_PERCENTAGE_MAP,
  BOTTLE_SIZE_ML_MAP,
} from "../../../entities/alcohol";
import { allDrinksFormAtom } from "./allDrinksModel";

export const useBehavior = () => {
  const { fields, submit } = allDrinksFormAtom;

  const drinks = fields.drinks.array();
  const drinksSidebar = drinks.map((drink) => ({
    name: drink.name.value(),
    percentage: drink.percentage.value(),
    typeOfBottle: drink.typeOfBottle.value(),
    sizeOfBottle: drink.sizeOfBottle.value(),
    count: drink.count.value(),
    breakTime: drink.breakTime.value(),
  }));

  const onAddDrink = () => {
    fields.drinks.create({
      name: "Beer",
      percentage: ALCOHOL_PERCENTAGE_MAP["Beer"],
      typeOfBottle: ALCOHOL_BOTTLE_TYPE_MAP["Beer"][0],
      sizeOfBottle: BOTTLE_SIZE_ML_MAP["Bottle"][0],
      count: 1,
      breakTime: null,
    });
  };

  const onRemoveDrink = (index: number) => {
    const drinks = fields.drinks.array();
    if (drinks[index]) {
      fields.drinks.remove(drinks[index]);
    }
  };

  return {
    onAddDrink,
    onRemoveDrink,
    drinksSidebar,
    drinks,
    durationFields: {
      start: fields.start,
      end: fields.end,
      weight: fields.weight,
      gender: fields.gender,
      age: fields.age,
    },
    submit,
  };
};
