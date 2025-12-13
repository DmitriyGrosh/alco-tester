import { bindField, reatomComponent } from "@reatom/react";
import { alcoFormListAtom } from "../model";
import type { FormEvent } from "react";
import { Button, Flex, Input, Select, Typography } from "antd";
import { ALCO_OPTIONS, ALCOHOL_BOTTLE_TYPE_MAP, ALCOHOL_BOTTLE_TYPE_OPTIONS_MAP, ALCOHOL_PERCENTAGE_MAP, BOTTLE_SIZE_ML_MAP, BOTTLE_SIZE_OPTIONS_MAP } from "../lib";

export const AlcoForm = reatomComponent(() => {
    const { fields: drinksFields, submit } = alcoFormListAtom

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        submit();
    }

    const onAddDrink = () => {
        drinksFields.drinks.create({ 
            name: "Beer",
            percentage: ALCOHOL_PERCENTAGE_MAP['Beer'],
            typeOfBottle: ALCOHOL_BOTTLE_TYPE_MAP['Beer'][0],
            sizeOfBottle: BOTTLE_SIZE_ML_MAP['Bottle'][0],
            count: 1 
        });
    }

    return (
        <form onSubmit={onSubmit}>
            <Flex vertical gap={16}>
                  {drinksFields.drinks.array().map((drink, index) => (
                    <Flex wrap="wrap" gap={8} key={index}>
                        <Flex style={{ minWidth: 200 }} vertical gap={4} flex={1}>
                            <Typography.Title level={5}>Alco Name</Typography.Title>
                            <Select 
                                options={ALCO_OPTIONS}
                                status={drink.name.validation().triggered && drink.name.validation().error ? "error" : undefined}
                                {...bindField(drink.name)}
                            />
                            {drink.name.validation().triggered && (
                                <Typography.Text type="danger">{drink.name.validation().error}</Typography.Text>
                            )}
                        </Flex>
                        <Flex style={{ minWidth: 200 }} vertical gap={4} flex={1}>
                            <Typography.Title level={5}>Alco Percentage</Typography.Title>
                            <Input
                                type="number"
                                status={drink.percentage.validation().triggered && drink.percentage.validation().error ? "error" : undefined}
                                {...bindField(drink.percentage)}
                             />
                            {drink.percentage.validation().triggered && (
                                <Typography.Text type="danger">{drink.percentage.validation().error}</Typography.Text>
                            )}
                        </Flex>
                        <Flex style={{ minWidth: 200 }} vertical gap={4} flex={1}>
                            <Typography.Title level={5}>Type of bottle</Typography.Title>
                            <Select 
                                options={ALCOHOL_BOTTLE_TYPE_OPTIONS_MAP[drink.name.value()]}
                                status={drink.typeOfBottle.validation().triggered && drink.typeOfBottle.validation().error ? "error" : undefined}
                                {...bindField(drink.typeOfBottle)}
                            />
                            {drink.typeOfBottle.validation().triggered && (
                                <Typography.Text type="danger">{drink.typeOfBottle.validation().error}</Typography.Text>
                            )}
                        </Flex>
                        <Flex style={{ minWidth: 200 }} vertical gap={4} flex={1}>
                            <Typography.Title level={5}>Size of bottle</Typography.Title>
                            <Select 
                                options={BOTTLE_SIZE_OPTIONS_MAP[drink.typeOfBottle.value()]}
                                disabled={!drink.typeOfBottle.value()}
                                status={drink.sizeOfBottle.validation().triggered && drink.sizeOfBottle.validation().error ? "error" : undefined}
                                {...bindField(drink.sizeOfBottle)}
                            />
                            {drink.sizeOfBottle.validation().triggered && (
                                <Typography.Text type="danger">{drink.sizeOfBottle.validation().error}</Typography.Text>
                            )}
                        </Flex>
                        <Flex style={{ minWidth: 200 }} vertical gap={4} flex={1}>
                            <Typography.Title level={5}>Count of drinks</Typography.Title>
                            <Input
                                type="number"
                                status={drink.count.validation().triggered && drink.count.validation().error ? "error" : undefined}
                                {...bindField(drink.count)}
                            />
                            {drink.count.validation().triggered && (
                                <Typography.Text type="danger">{drink.count.validation().error}</Typography.Text>
                            )}
                        </Flex>
                    </Flex>
                  ))}
                <Button onClick={onAddDrink}>Add Drink</Button>
                <Button type="primary" htmlType="submit">Submit</Button>
            </Flex>
        </form>
    );
});