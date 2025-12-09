import { reatomComponent } from "@reatom/react";
import { alcoFormAtom } from "../model";
import type { FormEvent } from "react";
import { Button, Flex, Input, Typography } from "antd";

export const AlcoForm = reatomComponent(() => {
    const { fields, submit } = alcoFormAtom;

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        submit();
    }

    const onAddDrink = () => {
        fields.drinks.create({alcoName: '', alcoPercentage: 0, alcoGrams: 0});
    }

    return (
        <form onSubmit={onSubmit}>
            <Flex vertical gap={16}>
                {fields.drinks.array().map((drink, index) => (
                    <Flex gap={8} key={index}>
                        <div>
                            <Typography.Title level={5}>Alco Name</Typography.Title>
                            <Input value={drink.alcoName.value()} onChange={(e) => drink.alcoName.set(e.target.value)} />
                        </div>
                        <div>
                            <Typography.Title level={5}>Alco Percentage</Typography.Title>
                            <Input value={drink.alcoPercentage.value()} onChange={(e) => drink.alcoPercentage.set(Number(e.target.value))} />
                        </div>
                        <div>
                            <Typography.Title level={5}>Alco Grams</Typography.Title>
                            <Input value={drink.alcoGrams.value()} onChange={(e) => drink.alcoGrams.set(Number(e.target.value))} />
                        </div>
                    </Flex>
                ))}
                <Button onClick={onAddDrink}>Add Drink</Button>
                <Button type="primary" htmlType="submit">Submit</Button>
            </Flex>
        </form>
    );
});