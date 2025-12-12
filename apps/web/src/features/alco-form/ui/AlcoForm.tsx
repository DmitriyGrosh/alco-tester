import { reatomComponent } from "@reatom/react";
import { alcoFormAtom } from "../model";
import type { FormEvent } from "react";
import { Button, Flex, Input, Select, Typography } from "antd";
import { ALCO_OPTIONS, ALCOHOL_BOTTLE_TYPE_OPTIONS_MAP, BOTTLE_SIZE_OPTIONS_MAP } from "../lib";

export const AlcoForm = reatomComponent(() => {
    const { fields, submit } = alcoFormAtom;

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        submit();
    }

    // const onAddDrink = () => {
    //     fields.drinks.create({name: 'Beer', percentage: ALCOHOL_PERCENTAGE_MAP['Beer'], grams: 100});
    // }

    return (
        <form onSubmit={onSubmit}>
            <Flex vertical gap={16}>
                  <Flex wrap="wrap" gap={8}>
                        <Flex style={{ minWidth: 200 }} vertical gap={4} flex={1}>
                            <Typography.Title level={5}>Alco Name</Typography.Title>
                            <Select 
                                value={fields.name.value()} 
                                onChange={(value) => fields.name.set(value)}
                                options={ALCO_OPTIONS}
                            />
                        </Flex>
                        <Flex style={{ minWidth: 200 }} vertical gap={4} flex={1}>
                            <Typography.Title level={5}>Alco Percentage</Typography.Title>
                            <Input type="number" value={fields.percentage.value()} onChange={(e) => fields.percentage.set(Number(e.target.value))} />
                        </Flex>
                        <Flex style={{ minWidth: 200 }} vertical gap={4} flex={1}>
                            <Typography.Title level={5}>Type of bottle</Typography.Title>
                            <Select 
                                value={fields.typeOfBottle.value()} 
                                onChange={(value) => fields.typeOfBottle.set(value)}
                                options={ALCOHOL_BOTTLE_TYPE_OPTIONS_MAP[fields.name.value()]}
                            />
                        </Flex>
                        <Flex style={{ minWidth: 200 }} vertical gap={4} flex={1}>
                            <Typography.Title level={5}>Size of bottle</Typography.Title>
                            <Select 
                                value={fields.sizeOfBottle.value()} 
                                onChange={(value) => fields.sizeOfBottle.set(value)}
                                options={fields.typeOfBottle.value() ? BOTTLE_SIZE_OPTIONS_MAP[fields.typeOfBottle.value()] : []}
                                disabled={!fields.typeOfBottle.value()}
                            />
                        </Flex>
                        <Flex style={{ minWidth: 200 }} vertical gap={4} flex={1}>
                            <Typography.Title level={5}>Count of drinks</Typography.Title>
                            <Input value={fields.count.value()} onChange={(e) => fields.count.set(Number(e.target.value))} />
                        </Flex>
                    </Flex>
                {/* <Button onClick={onAddDrink}>Add Drink</Button> */}
                <Button type="primary" htmlType="submit">Submit</Button>
            </Flex>
        </form>
    );
});