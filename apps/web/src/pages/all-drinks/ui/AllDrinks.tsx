import { reatomComponent } from "@reatom/react";
import { Button, Flex, Typography, theme } from "antd";
import { useTranslation } from "react-i18next";
import { allDrinksRoute } from "../../../shared/routing";
import { Sidebar } from "../../../shared/ui";
import { AllDrinksForm } from "./AllDrinksForm";
import { PlusOutlined } from "@ant-design/icons";
import { useBehavior } from "../model";
import { ModalDuration } from "./ModalDuration";
import { useState } from "react";
import { AllDrinksSidebar } from "../../../entities/alcohol";

export const AllDrinks = reatomComponent(() => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const params = allDrinksRoute();
  const { onAddDrink } = useBehavior();
  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);
  const { onRemoveDrink, drinksSidebar } = useBehavior();

  if (!allDrinksRoute.exact()) {
    return null;
  }

  return (
    <Sidebar
      onClose={() => allDrinksRoute.go({ drawer: "hide" })}
      sidebar={<AllDrinksSidebar drinks={drinksSidebar} onRemoveDrink={onRemoveDrink} />}
      isDrawer={params?.drawer === "show"}
    >
      <Flex vertical style={{ height: "100%" }}>
        <Flex
          vertical
          gap={16}
          style={{
            padding: 16,
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
          }}
        >
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
            <AllDrinksForm />
          </Flex>
        </Flex>

        <Flex
          gap={4}
          style={{
            flexShrink: 0,
            padding: 16,
            background: token.colorBgContainer,
            borderTop: `1px solid ${token.colorBorderSecondary}`,
            zIndex: 10,
          }}
        >
          <Button
            block
            onClick={onAddDrink}
            type="default"
            icon={<PlusOutlined />}
          >
            {t("alcoForm.addDrink")}
          </Button>
          <Button block type="primary" onClick={() => setOpen(true)}>
            {t("alcoForm.whenISober")}
          </Button>
        </Flex>
      </Flex>
      <ModalDuration open={open} onClose={onClose} />
    </Sidebar>
  );
});
