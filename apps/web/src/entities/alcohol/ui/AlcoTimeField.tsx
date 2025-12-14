import { reatomComponent, bindField } from "@reatom/react";
import { Flex, DatePicker, Typography } from "antd";
import { useTranslation } from "react-i18next";
import type { FieldAtom } from "@reatom/core";
// import { type Dayjs } from "dayjs";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timeField: FieldAtom<any>;
};

export const AlcoTimeField = reatomComponent<Props>(({ timeField }) => {
  const { t } = useTranslation();
  return (
    <Flex style={{ minWidth: 220 }} vertical gap={4} flex={1}>
      <Typography.Title level={5}>
        {t("alcoForm.drinkingTime")}
      </Typography.Title>
      <DatePicker
        showTime
        allowClear
        style={{ width: "100%" }}
        format="DD.MM.YYYY HH:mm"
        status={
          timeField.validation().triggered && timeField.validation().error
            ? "error"
            : undefined
        }
        {...bindField(timeField)}
      />
      {timeField.validation().triggered && (
        <Typography.Text type="danger">
          {timeField.validation().error}
        </Typography.Text>
      )}
    </Flex>
  );
});
