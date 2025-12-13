import { bindField, reatomComponent } from "@reatom/react";
import { Flex, Select, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { type AlcoholType } from "../lib";
import { useBehavior } from "../model";
import type { FieldAtom } from "@reatom/core";

type Props = {
  nameField: FieldAtom<AlcoholType, AlcoholType>;
};

export const AlcoNameField = reatomComponent<Props>(({ nameField }) => {
  const { t } = useTranslation();
  const { alcoOptions } = useBehavior();

  return (
    <Flex style={{ minWidth: 200 }} vertical gap={4} flex={1}>
      <Typography.Title level={5}>{t("alcoForm.alcoName")}</Typography.Title>
      <Select
        options={alcoOptions}
        status={
          nameField.validation().triggered && nameField.validation().error
            ? "error"
            : undefined
        }
        {...bindField(nameField)}
      />
      {nameField.validation().triggered && (
        <Typography.Text type="danger">
          {nameField.validation().error}
        </Typography.Text>
      )}
    </Flex>
  );
});
