import { reatomComponent } from "@reatom/react";
import { Card, Flex } from "antd";
import {
  AlcoCountOfDrinksField,
  AlcoNameField,
  AlcoPercantageField,
  AlcoSizeOfBottleField,
  AlcoTypeOfBottleField,
} from "../../../entities/alcohol";
import { BreakTimeButton } from "./BreakTimeButton";
import { useBehavior } from "../model";

export const AllDrinksForm = reatomComponent(() => {
  const { drinks  } = useBehavior();
  const isLastDrink = (index: number) => drinks.length === index + 1;

  return (
    <Flex vertical gap={4} style={{ width: "100%" }}>
      {drinks.map((drink, index) => (
        <Flex vertical gap={4} key={index.toString(36)}>
          <Card>
            <Flex gap={4} style={{ width: "100%" }} wrap="wrap">
              <AlcoNameField nameField={drink.name} />
              <AlcoPercantageField percentageField={drink.percentage} />
              <AlcoTypeOfBottleField
                nameField={drink.name}
                typeOfBottleField={drink.typeOfBottle}
              />
              <AlcoSizeOfBottleField
                typeOfBottleField={drink.typeOfBottle}
                sizeOfBottleField={drink.sizeOfBottle}
              />
              <AlcoCountOfDrinksField countField={drink.count} />
            </Flex>
          </Card>
          {drinks.length > 1 && !isLastDrink(index) && (
            <BreakTimeButton breakTimeField={drink.breakTime} />
          )}
        </Flex>
      ))}
    </Flex>
  );
});
