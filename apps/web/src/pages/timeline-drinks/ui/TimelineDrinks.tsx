import { reatomComponent } from "@reatom/react";
import { Button, Flex, theme, Typography } from "antd";
import { timelineDrinksRoute } from "../../../shared/routing";
import { Sidebar } from "../../../shared/ui/sidebar/Sidebar";
import { UserStats } from "./UserStats";
import { CalculatorOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useBehavior } from "../model";
import { DrinksTimelineForm } from "./DrinksTimelineForm";
import { AllDrinksSidebar } from "../../../entities/alcohol";
// import { DrinksChart } from "./DrinksChart";

const { Title } = Typography;

export const TimelineDrinks = reatomComponent(() => {
  const params = timelineDrinksRoute();
  const { token } = theme.useToken();
  const { t } = useTranslation();
  const { onAddDrink, onRemoveDrink, drinksSidebar, submit } = useBehavior();

  if (!timelineDrinksRoute.exact()) {
    return null;
  }

  return (
    <Sidebar
      onClose={() => timelineDrinksRoute.go({ drawer: "hide" })}
      sidebar={<AllDrinksSidebar drinks={drinksSidebar} onRemoveDrink={onRemoveDrink} />}
      isDrawer={params?.drawer === "show"}
    >
      <Flex vertical style={{ height: "100%" }}>
        <Flex vertical gap={16} style={{ padding: "16px 16px 0 16px" }}>
          <Flex align="center" gap={16}>
            <Title level={4} style={{ margin: 0 }}>
              {t("home.modes.timeline.calculatorTitle")}
            </Title>
          </Flex>

          <UserStats />
        </Flex>
        <Flex
          vertical
          gap={8}
          style={{
            padding: "0 16px 16px 16px",
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
          }}
        >
          {/* <DrinksChart /> */}
          <DrinksTimelineForm />
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
          <Button
            block
            onClick={submit}
            type="primary"
            icon={<CalculatorOutlined />}
          >
            {t("alcoForm.calculate")}
          </Button>
        </Flex>
      </Flex>
    </Sidebar>
  );
});
