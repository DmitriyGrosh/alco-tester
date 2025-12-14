import { reatomComponent } from "@reatom/react";
import { Button, Flex, Tooltip, Typography, theme } from "antd";
import { useTranslation } from "react-i18next";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import type {
  AlcoholType,
  SizeOfBottle,
  TypeOfBottle,
} from "../../../entities/alcohol";

type Drink = {
  name: AlcoholType;
  percentage: string;
  typeOfBottle: TypeOfBottle;
  sizeOfBottle: SizeOfBottle;
  count: string;
  breakTime: string | null;
};
type Props = {
  drinks: Drink[];
  onRemoveDrink: (index: number) => void;
};

export const AllDrinksSidebar = reatomComponent<Props>(
  ({ drinks, onRemoveDrink }) => {
    const { t } = useTranslation();
    const { token } = theme.useToken();

    const totalVolume = drinks.reduce(
      (acc, drink) =>
        acc + Number(drink.count) * Number(drink.sizeOfBottle),
      0,
    );

    const weightedPercentage = drinks.reduce(
      (acc, drink) =>
        acc +
        Number(drink.percentage) *
          (Number(drink.count) * Number(drink.sizeOfBottle)),
      0,
    );

    const averagePercentage =
      totalVolume > 0 ? weightedPercentage / totalVolume : 0;

    const totalPureAlcohol = drinks.reduce((acc, drink) => {
      const volume =
        Number(drink.count) * Number(drink.sizeOfBottle);
      const percentage = Number(drink.percentage);
      const pureAlcohol = (volume * percentage * 0.79) / 100;
      return acc + pureAlcohol;
    }, 0);

    const totalStandardUnits = totalPureAlcohol / 10;

    return (
      <Flex vertical gap={16} style={{ height: "100%" }}>
        <Flex
          vertical
          style={{ flex: 1, overflowY: "auto", paddingBottom: 32 }}
          gap={16}
        >
          <Flex vertical gap={12}>
            {drinks.map((drink, index) => (
              <Flex vertical gap={8} key={index}>
                <Flex
                  vertical
                  style={{
                    padding: 12,
                    background: token.colorBgContainer,
                    borderRadius: token.borderRadiusLG,
                    border: `1px solid ${token.colorBorderSecondary}`,
                  }}
                >
                  <Flex justify="space-between" align="center">
                    <Typography.Text strong>
                      {t(`alcoForm.options.alco.${drink.name}`)}
                    </Typography.Text>
                    <Flex align="center" gap={8}>
                      <Typography.Text type="secondary">
                        {drink.count} x {drink.sizeOfBottle}{" "}
                        {t("units.ml")}
                      </Typography.Text>
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => onRemoveDrink(index)}
                      />
                    </Flex>
                  </Flex>
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    {drink.percentage}% |{" "}
                    {t(
                      `alcoForm.options.bottleType.${drink.typeOfBottle}`,
                    )}
                  </Typography.Text>
                </Flex>
                {drink.breakTime && (
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: 12, marginTop: 4 }}
                  >
                    {t("alcoForm.breakBetweenDrinks")}:{" "}
                    {t(
                      `alcoForm.time.${drink.breakTime?.replace(/\s+/g, "")}`,
                    )}
                  </Typography.Text>
                )}
              </Flex>
            ))}
          </Flex>
        </Flex>

        <Flex
          vertical
          style={{
            marginTop: "auto",
            padding: "16px 16px 0 16px",
            background: token.colorBgContainer,
            borderTop: `1px solid ${token.colorBorderSecondary}`,
            margin: "-16px",
            position: "sticky",
            bottom: 0,
          }}
        >
          <Flex justify="space-between" align="center">
            <Typography.Text type="secondary">
              {t("alcoForm.averagePercentage")}:
            </Typography.Text>
            <Typography.Text strong>
              {averagePercentage.toFixed(1)}%
            </Typography.Text>
          </Flex>
          <Flex justify="space-between" align="center">
            <Typography.Text type="secondary">
              {t("alcoForm.totalVolume")}:
            </Typography.Text>
            <Typography.Text strong>
              {totalVolume} {t("units.ml")}
            </Typography.Text>
          </Flex>
          <Flex justify="space-between" align="center">
            <Flex gap={4} align="center">
              <Typography.Text type="secondary">
                {t("alcoForm.pureAlcohol")}:
              </Typography.Text>
              <Tooltip title={t("alcoForm.pureAlcoholTooltip")}>
                <QuestionCircleOutlined
                  style={{ color: token.colorTextSecondary }}
                />
              </Tooltip>
            </Flex>
            <Typography.Text strong>
              {totalPureAlcohol.toFixed(1)} {t("units.g")}
            </Typography.Text>
          </Flex>
          <Flex justify="space-between" align="center">
            <Flex gap={4} align="center">
              <Typography.Text type="secondary">
                {t("alcoForm.standardUnits")}:
              </Typography.Text>
              <Tooltip title={t("alcoForm.standardUnitsTooltip")}>
                <QuestionCircleOutlined
                  style={{ color: token.colorTextSecondary }}
                />
              </Tooltip>
            </Flex>
            <Typography.Text strong>
              {totalStandardUnits.toFixed(1)}
            </Typography.Text>
          </Flex>
        </Flex>
      </Flex>
    );
  },
);
