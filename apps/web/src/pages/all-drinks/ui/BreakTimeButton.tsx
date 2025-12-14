import { reatomComponent } from "@reatom/react";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { bindField } from "@reatom/react";
import { type FieldAtom } from "@reatom/core";
import { type MenuProps } from "antd";
import { Dropdown, Button, Flex } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";

export const BreakTimeButton = reatomComponent<{
  breakTimeField: FieldAtom<string | null>;
}>(({ breakTimeField }) => {
  const { t } = useTranslation();
  const { value, onChange } = bindField(breakTimeField);

  const items: MenuProps["items"] = useMemo(
    () => [
      {
        key: "5 minutes",
        label: t("alcoForm.time.5minutes"),
      },
      {
        key: "10 minutes",
        label: t("alcoForm.time.10minutes"),
      },
      {
        key: "15 minutes",
        label: t("alcoForm.time.15minutes"),
      },
      {
        key: "30 minutes",
        label: t("alcoForm.time.30minutes"),
      },
      {
        key: "1 hour",
        label: t("alcoForm.time.1hour"),
      },
      {
        key: "1 hour 30 minutes",
        label: t("alcoForm.time.1hour30minutes"),
      },
      {
        key: "2 hours",
        label: t("alcoForm.time.2hours"),
      },
    ],
    [t],
  );

  const selectedLabel = useMemo(() => {
    const item = items.find((i) => i && "key" in i && i.key === value);
    return item && "label" in item ? item.label : null;
  }, [items, value]);

  return (
    <Flex justify="center">
      <Dropdown
        trigger={["click"]}
        menu={{
          selectable: true,
          items,
          onClick: (e) => onChange(e.key),
          selectedKeys: value ? [value] : [],
        }}
      >
        <Button icon={selectedLabel ? <EditOutlined /> : <PlusOutlined />}>
          {selectedLabel || t("alcoForm.breakBetweenDrinks")}
        </Button>
      </Dropdown>
    </Flex>
  );
});
