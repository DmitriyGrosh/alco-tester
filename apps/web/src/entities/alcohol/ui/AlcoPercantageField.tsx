import type { FieldAtom } from "@reatom/core";
import { reatomComponent, bindField } from "@reatom/react";
import { Flex, Typography, Input } from "antd";
import { useTranslation } from "react-i18next";

type Props = {
  percentageField: FieldAtom<number, string>;
};

export const AlcoPercantageField = reatomComponent<Props>(
  ({ percentageField }) => {
    const { t } = useTranslation();
    return (
      <Flex style={{ minWidth: 150 }} vertical gap={4} flex={1}>
        <Typography.Title level={5}>
          {t("alcoForm.percentage")}
        </Typography.Title>
        <Input
          type="number"
          status={
            percentageField.validation().triggered &&
            percentageField.validation().error
              ? "error"
              : undefined
          }
          {...bindField(percentageField)}
        />
        {percentageField.validation().triggered && (
          <Typography.Text type="danger">
            {percentageField.validation().error}
          </Typography.Text>
        )}
      </Flex>
    );
  },
);
