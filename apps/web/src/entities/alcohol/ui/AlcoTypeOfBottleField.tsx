import { reatomComponent, bindField } from "@reatom/react";
import { Flex, Typography, Select } from "antd";
import { useTranslation } from "react-i18next";
import { type AlcoholType, type TypeOfBottle } from "../lib";
import { useBehavior } from "../model";
import type { FieldAtom } from "@reatom/core";

type Props = {
  nameField: FieldAtom<AlcoholType, AlcoholType>;
  typeOfBottleField: FieldAtom<TypeOfBottle, TypeOfBottle>;
};

export const AlcoTypeOfBottleField = reatomComponent<Props>(
  ({ nameField, typeOfBottleField }) => {
    const { t } = useTranslation();
    const { getBottleTypeOptions } = useBehavior();
    return (
      <Flex style={{ minWidth: 150 }} vertical gap={4} flex={1}>
        <Typography.Title level={5}>
          {t("alcoForm.typeOfBottle")}
        </Typography.Title>
        <Select
          options={getBottleTypeOptions(nameField.value())}
          status={
            typeOfBottleField.validation().triggered &&
            typeOfBottleField.validation().error
              ? "error"
              : undefined
          }
          {...bindField(typeOfBottleField)}
        />
        {typeOfBottleField.validation().triggered && (
          <Typography.Text type="danger">
            {typeOfBottleField.validation().error}
          </Typography.Text>
        )}
      </Flex>
    );
  },
);
