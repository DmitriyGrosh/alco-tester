import { reatomComponent, bindField } from "@reatom/react";
import { Flex, Input, Typography } from "antd";
import { useTranslation } from "react-i18next";
import type { FieldAtom } from "@reatom/core";

type Props = {
  countField: FieldAtom<number, string>;
};

export const AlcoCountOfDrinksField = reatomComponent<Props>(
  ({ countField }) => {
    const { t } = useTranslation();
    return (
      <Flex style={{ minWidth: 200 }} vertical gap={4} flex={1}>
        <Typography.Title level={5}>{t("alcoForm.count")}</Typography.Title>
        <Input
          type="number"
          status={
            countField.validation().triggered && countField.validation().error
              ? "error"
              : undefined
          }
          {...bindField(countField)}
        />
        {countField.validation().triggered && (
          <Typography.Text type="danger">
            {countField.validation().error}
          </Typography.Text>
        )}
      </Flex>
    );
  },
);
