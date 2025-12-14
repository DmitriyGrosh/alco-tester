import { reatomComponent, bindField } from "@reatom/react";
import { Form, Flex, Input, Select } from "antd";
import { useTranslation } from "react-i18next";
import { useBehavior } from "../model";

export const UserStats = reatomComponent(() => {
  const { t } = useTranslation();
  const { fields } = useBehavior();

  return (
    <Form layout="vertical">
      <Flex gap={8}>
        <Form.Item label={t("alcoForm.weight")} style={{ width: 120 }}>
          <Input type="number" {...bindField(fields.weight)} addonAfter="kg" />
        </Form.Item>
        <Form.Item label={t("alcoForm.height")} style={{ width: 120 }}>
          <Input
            type="number"
            {...bindField(fields.height)}
            addonAfter={t("units.cm")}
          />
        </Form.Item>
        <Form.Item label={t("alcoForm.gender")}>
          <Select
            style={{ width: 120 }}
            options={[
              { value: "male", label: t("alcoForm.genderMale") },
              { value: "female", label: t("alcoForm.genderFemale") },
            ]}
            {...bindField(fields.gender)}
          />
        </Form.Item>
      </Flex>
    </Form>
  );
});
