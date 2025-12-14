import { reatomComponent } from "@reatom/react";
import { Button, Flex, Select, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { homeRoute } from "../../shared/routing";
import { ArrowLeftOutlined } from "@ant-design/icons";

export const Header = reatomComponent(() => {
  const { i18n, t } = useTranslation();

  return (
    <Flex
      justify="space-between"
      align="center"
      style={{ padding: "0 16px", height: "100%" }}
    >
      <Flex gap={8} align="center">
        {!homeRoute.exact() && (
          <Button
            type="link"
            onClick={() => homeRoute.go()}
            style={{ padding: 0 }}
          >
            <ArrowLeftOutlined />
          </Button>
        )}
        <Typography.Title
          onClick={() => homeRoute.go()}
          level={5}
          style={{ margin: 0, cursor: "pointer" }}
        >
          {t("header.title")}
        </Typography.Title>
      </Flex>
      <Select
        size="middle"
        style={{ width: 60 }}
        value={i18n.language}
        onChange={(value) => i18n.changeLanguage(value)}
        options={[
          { value: "en", label: "🇺🇸" },
          { value: "ru", label: "🇷🇺" },
        ]}
      />
    </Flex>
  );
});
