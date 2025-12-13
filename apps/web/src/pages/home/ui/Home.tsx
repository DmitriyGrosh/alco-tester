import { reatomComponent } from "@reatom/react";
import { Card, Typography, Flex } from "antd";
import { useTranslation } from "react-i18next";
import {
  allDrinksRoute,
  homeRoute,
  timelineDrinksRoute,
} from "../../../shared/routing";

const { Title, Text } = Typography;

export const Home = reatomComponent(() => {
  const { t } = useTranslation();
  if (!homeRoute.exact()) {
    return null;
  }

  return (
    <Flex
      vertical
      gap={48}
      justify="center"
      align="center"
      style={{ height: "100%", padding: 16 }}
    >
      <Flex vertical gap={8} align="center" style={{ textAlign: "center" }}>
        <Title level={2} style={{ margin: 0 }}>
          {t("home.title")}
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          {t("home.description")}
        </Text>
      </Flex>

      <Flex gap={24} wrap="wrap" justify="center">
        <Card
          hoverable
          style={{ width: 300, textAlign: "center" }}
          onClick={() => allDrinksRoute.go({ drawer: "hide" })}
        >
          <Title level={4}>{t("home.modes.list.title")}</Title>
          <Text>{t("home.modes.list.description")}</Text>
        </Card>

        <Card
          hoverable
          style={{ width: 300, textAlign: "center" }}
          onClick={() => timelineDrinksRoute.go({ drawer: "hide" })}
        >
          <Title level={4}>{t("home.modes.timeline.title")}</Title>
          <Text>{t("home.modes.timeline.description")}</Text>
        </Card>
      </Flex>
    </Flex>
  );
});
