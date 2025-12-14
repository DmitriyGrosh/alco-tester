import { reatomComponent } from "@reatom/react";
import { Button, Card, Flex } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useBehavior } from "../model";
import {
  AlcoNameField,
  AlcoPercantageField,
  AlcoSizeOfBottleField,
  AlcoTimeField,
  AlcoTypeOfBottleField,
  AlcoCountOfDrinksField,
} from "../../../entities/alcohol";

export const DrinksTimelineForm = reatomComponent(() => {
  const { fields, onRemoveDrink } = useBehavior();

  return (
    <>
      {fields.drinks.array().map((drink, index) => (
        <Card key={index} size="small" type="inner">
          <Flex gap={8} wrap="wrap" align="end">
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
            <AlcoTimeField timeField={drink.time} />
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => onRemoveDrink(index)}
            />
          </Flex>
        </Card>
      ))}
    </>
  );
});
