import { reatomComponent } from "@reatom/react";
import { Button, Flex, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { homeRoute, timelineDrinksRoute } from "../../../shared/routing";

const { Text } = Typography;

export const TimelineDrinks = reatomComponent(() => {
  const { t } = useTranslation();
  if (!timelineDrinksRoute.exact()) {
    return null;
  }
  return (
    <Flex vertical gap={16} style={{ padding: 24 }}>
      <Button onClick={() => homeRoute.go()} style={{ width: "fit-content" }}>
        {t("home.modes.back")}
      </Button>
      <Text>{t("home.modes.timeline.placeholder")}</Text>
    </Flex>
  );
});
