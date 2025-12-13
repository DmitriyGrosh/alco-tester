import { reatomComponent } from "@reatom/react";
import { alcoFormListAtom } from "../model";
import type { FormEvent } from "react";
import { Button, Flex, Input, Select, Typography } from "antd";
import { ALCO_OPTIONS, ALCOHOL_BOTTLE_TYPE_MAP, ALCOHOL_BOTTLE_TYPE_OPTIONS_MAP, ALCOHOL_PERCENTAGE_MAP, ALCOHOLS, BOTTLE_SIZE_ML_MAP, BOTTLE_SIZE_OPTIONS_MAP, type AlcoholType } from "../lib";

export const AlcoForm = reatomComponent(() => {
    // const { fields, submit } = alcoFormAtom;
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
                  {drinksFields.drinks.array().map((drink) => (
                    <Flex wrap="wrap" gap={8}>
                        <Flex style={{ minWidth: 200 }} vertical gap={4} flex={1}>
                            <Typography.Title level={5}>Alco Name</Typography.Title>
                            <Select 
                                value={drink.name.value()} 
                                onChange={(value) => drink.name.set(value)}
                                options={ALCO_OPTIONS}
                            />
                        </Flex>
                        <Flex style={{ minWidth: 200 }} vertical gap={4} flex={1}>
                            <Typography.Title level={5}>Alco Percentage</Typography.Title>
                            <Input type="number" value={drink.percentage.value()} onChange={(e) => drink.percentage.set(Number(e.target.value))} />
                        </Flex>
                        <Flex style={{ minWidth: 200 }} vertical gap={4} flex={1}>
                            <Typography.Title level={5}>Type of bottle</Typography.Title>
                            <Select 
                                value={drink.typeOfBottle.value()} 
                                onChange={(value) => drink.typeOfBottle.set(value)}
                                options={ALCOHOL_BOTTLE_TYPE_OPTIONS_MAP[drink.name.value() as AlcoholType]}
                            />
                        </Flex>
                        <Flex style={{ minWidth: 200 }} vertical gap={4} flex={1}>
                            <Typography.Title level={5}>Size of bottle</Typography.Title>
                            <Select 
                                value={drink.sizeOfBottle.value()} 
                                onChange={(value) => drink.sizeOfBottle.set(value)}
                                options={drink.typeOfBottle.value() ? BOTTLE_SIZE_OPTIONS_MAP[drink.typeOfBottle.value()] : []}
                                disabled={!drink.typeOfBottle.value()}
                            />
                        </Flex>
                        <Flex style={{ minWidth: 200 }} vertical gap={4} flex={1}>
                            <Typography.Title level={5}>Count of drinks</Typography.Title>
                            <Input value={drink.count.value()} onChange={(e) => drink.count.set(Number(e.target.value))} />
                        </Flex>
                    </Flex>
                  ))}
                <Button onClick={onAddDrink}>Add Drink</Button>
                <Button type="primary" htmlType="submit">Submit</Button>
            </Flex>
        </form>
    );
});