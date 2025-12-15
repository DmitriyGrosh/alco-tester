import { reatomComponent } from "@reatom/react";
import { Button, Flex } from "antd";
import { timelineDrinksRoute } from "../../../shared/routing";
import { Sidebar } from "../../../shared/ui/sidebar/Sidebar";
import { UserStats } from "./UserStats";
import { CalculatorOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useBehavior } from "../model";
import { DrinksTimelineForm } from "./DrinksTimelineForm";
import { AllDrinksSidebar } from "../../../entities/alcohol";
import { FormScrollableWrapper } from "../../../shared/ui/form-scrollable-wrapper";

export const TimelineDrinks = reatomComponent(() => {
  const params = timelineDrinksRoute();
  const { t } = useTranslation();
  const { onAddDrink, onRemoveDrink, drinksSidebar, submit } = useBehavior();

  if (!timelineDrinksRoute.exact()) {
    return null;
  }

  return (
    <Sidebar
      onClose={() => timelineDrinksRoute.go({ drawer: "hide" })}
      sidebar={
        <AllDrinksSidebar
          drinks={drinksSidebar}
          onRemoveDrink={onRemoveDrink}
        />
      }
      isDrawer={params?.drawer === "show"}
    >
      <FormScrollableWrapper
        title={t("home.modes.timeline.calculatorTitle")}
        FixedHeader={<UserStats />}
        FixedFooter={
          <Flex gap={8}>
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
              {t("alcoForm.whenISober")}
            </Button>
          </Flex>
        }
        ScrollableContent={<DrinksTimelineForm />}
      />
    </Sidebar>
  );
});
