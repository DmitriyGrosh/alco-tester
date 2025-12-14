import { reatomComponent, bindField } from "@reatom/react";
import { Flex, Typography, Select } from "antd";
import { useTranslation } from "react-i18next";
import { type SizeOfBottle, type TypeOfBottle } from "../lib";
import { useBehavior } from "../model";
import type { FieldAtom } from "@reatom/core";

type Props = {
  typeOfBottleField: FieldAtom<TypeOfBottle, TypeOfBottle>;
  sizeOfBottleField: FieldAtom<SizeOfBottle, SizeOfBottle>;
};

export const AlcoSizeOfBottleField = reatomComponent<Props>(
  ({ typeOfBottleField, sizeOfBottleField }) => {
    const { t } = useTranslation();
    const { getBottleSizeOptions } = useBehavior();
    return (
      <Flex style={{ minWidth: 150, maxWidth: 250 }} vertical gap={4} flex={1}>
        <Typography.Title level={5}>
          {t("alcoForm.sizeOfBottle")}
        </Typography.Title>
        <Select
          options={getBottleSizeOptions(typeOfBottleField.value())}
          disabled={!typeOfBottleField.value()}
          status={
            sizeOfBottleField.validation().triggered &&
            sizeOfBottleField.validation().error
              ? "error"
              : undefined
          }
          {...bindField(sizeOfBottleField)}
        />
        {sizeOfBottleField.validation().triggered && (
          <Typography.Text type="danger">
            {sizeOfBottleField.validation().error}
          </Typography.Text>
        )}
      </Flex>
    );
  },
);
