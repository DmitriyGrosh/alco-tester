import { reatomComponent, bindField } from "@reatom/react";
import { Form, Flex, Input, Select, DatePicker, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useBehavior } from "../model";

export const UserForm = reatomComponent(() => {
  const { t } = useTranslation();
  const { durationFields } = useBehavior();

  return (
    <Form layout="vertical">
      <Flex vertical gap={16}>
        <Flex gap={8} wrap="wrap">
          <Form.Item
            label={t("alcoForm.drinkingStart")}
            style={{ minWidth: 220, flex: 1 }}
          >
            <DatePicker
              showTime
              allowClear
              style={{ width: "100%" }}
              format="DD.MM.YYYY HH:mm"
              status={
                durationFields.start.validation().triggered &&
                durationFields.start.validation().error
                  ? "error"
                  : undefined
              }
              {...bindField(durationFields.start)}
            />
            {durationFields.start.validation().triggered && (
              <Typography.Text type="danger" style={{ fontSize: 12 }}>
                {durationFields.start.validation().error}
              </Typography.Text>
            )}
          </Form.Item>

          <Form.Item
            label={t("alcoForm.drinkingEnd")}
            style={{ minWidth: 220, flex: 1 }}
          >
            <DatePicker
              showTime
              allowClear
              style={{ width: "100%" }}
              format="DD.MM.YYYY HH:mm"
              status={
                durationFields.end.validation().triggered &&
                durationFields.end.validation().error
                  ? "error"
                  : undefined
              }
              {...bindField(durationFields.end)}
            />
            {durationFields.end.validation().triggered && (
              <Typography.Text type="danger" style={{ fontSize: 12 }}>
                {durationFields.end.validation().error}
              </Typography.Text>
            )}
          </Form.Item>
        </Flex>

        <Flex gap={8} wrap="wrap">
          <Form.Item label={t("alcoForm.weight")} style={{ width: 120 }}>
            <Input
              type="number"
              {...bindField(durationFields.weight)}
              addonAfter="kg"
              status={
                durationFields.weight.validation().triggered &&
                durationFields.weight.validation().error
                  ? "error"
                  : undefined
              }
            />
            {durationFields.weight.validation().triggered && (
              <Typography.Text type="danger" style={{ fontSize: 12 }}>
                {durationFields.weight.validation().error}
              </Typography.Text>
            )}
          </Form.Item>

          <Form.Item label={t("alcoForm.age")} style={{ width: 120 }}>
            <Input
              type="number"
              {...bindField(durationFields.age)}
              status={
                durationFields.age.validation().triggered &&
                durationFields.age.validation().error
                  ? "error"
                  : undefined
              }
            />
            {durationFields.age.validation().triggered && (
              <Typography.Text type="danger" style={{ fontSize: 12 }}>
                {durationFields.age.validation().error}
              </Typography.Text>
            )}
          </Form.Item>

          <Form.Item label={t("alcoForm.gender")} style={{ width: 120 }}>
            <Select
              style={{ width: "100%" }}
              options={[
                { value: "male", label: t("alcoForm.genderMale") },
                { value: "female", label: t("alcoForm.genderFemale") },
              ]}
              {...bindField(durationFields.gender)}
              status={
                durationFields.gender.validation().triggered &&
                durationFields.gender.validation().error
                  ? "error"
                  : undefined
              }
            />
            {durationFields.gender.validation().triggered && (
              <Typography.Text type="danger" style={{ fontSize: 12 }}>
                {durationFields.gender.validation().error}
              </Typography.Text>
            )}
          </Form.Item>
        </Flex>
      </Flex>
    </Form>
  );
});
