import { reatomComponent } from "@reatom/react";
import { Button, Flex } from "antd";
import { useTranslation } from "react-i18next";
import { allDrinksRoute } from "../../../shared/routing";
import { Sidebar } from "../../../shared/ui";
import { AllDrinksForm } from "./AllDrinksForm";
import { PlusOutlined } from "@ant-design/icons";
import { useBehavior } from "../model";
import { AllDrinksSidebar } from "../../../entities/alcohol";
import { FormScrollableWrapper } from "../../../shared/ui/form-scrollable-wrapper";
import { UserForm } from "./UserForm";

export const AllDrinks = reatomComponent(() => {
  const { t } = useTranslation();
  const params = allDrinksRoute();
  const { onRemoveDrink, drinksSidebar, onAddDrink, submit } = useBehavior();

  if (!allDrinksRoute.exact()) {
    return null;
  }

  return (
    <Sidebar
      onClose={() => allDrinksRoute.go({ drawer: "hide" })}
      sidebar={
        <AllDrinksSidebar
          drinks={drinksSidebar}
          onRemoveDrink={onRemoveDrink}
        />
      }
      isDrawer={params?.drawer === "show"}
    >
      <FormScrollableWrapper
        title={t("home.modes.list.title")}
        FixedHeader={<UserForm />}
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
            <Button block type="primary" onClick={submit}>
              {t("alcoForm.whenISober")}
            </Button>
          </Flex>
        }
        ScrollableContent={<AllDrinksForm />}
      />
    </Sidebar>
  );
});
