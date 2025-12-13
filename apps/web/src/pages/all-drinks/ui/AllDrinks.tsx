import { reatomComponent } from "@reatom/react";
import { Button, Flex, Typography, theme } from "antd";
import { useTranslation } from "react-i18next";
import { allDrinksRoute } from "../../../shared/routing";
import { Sidebar } from "../../../shared/ui";

export const AllDrinks = reatomComponent(() => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const params = allDrinksRoute();
  console.log("allDrinksRoute", params);

  if (!allDrinksRoute.exact()) {
    return null;
  }

  return (
    <Sidebar
      onClose={() => allDrinksRoute.go({ drawer: "hide" })}
      sidebar={<div>sidebar</div>}
      isDrawer={params?.drawer === "show"}
    >
      <Flex vertical style={{ minHeight: "100%" }}>
        <Flex vertical gap={16} style={{ padding: 16, flex: 1 }}>
          <Flex vertical gap={4}>
            <Typography.Title level={2} style={{ margin: 0 }}>
              {t("home.modes.list.title")}
            </Typography.Title>
            <Typography.Text type="secondary">
              {t("home.modes.list.description")}
            </Typography.Text>
          </Flex>

          {/* Form container */}
          <Flex vertical gap={16}>
            {/* Form items will go here */}
          </Flex>
        </Flex>

        <div
          style={{
            position: "sticky",
            bottom: 0,
            padding: 16,
            background: token.colorBgContainer,
            borderTop: `1px solid ${token.colorBorderSecondary}`,
            zIndex: 10,
          }}
        >
          <Button type="primary" block size="large">
            {t("alcoForm.submit")}
          </Button>
        </div>
      </Flex>
    </Sidebar>
  );
});
