import { reatomComponent } from "@reatom/react";
import { Flex, Typography, theme } from "antd";
import { t } from "i18next";

const { Title } = Typography;

type Props = {
  FixedHeader: React.ReactNode;
  FixedFooter: React.ReactNode;
  ScrollableContent: React.ReactNode;
  title: string;
};

export const FormScrollableWrapper = reatomComponent<Props>(
  ({ FixedHeader, FixedFooter, ScrollableContent, title }) => {
    const { token } = theme.useToken();
    return (
      <Flex vertical style={{ height: "100%" }}>
        <Flex vertical gap={16} style={{ padding: "16px 16px 0 16px" }}>
          <Flex align="center" gap={16}>
            <Title level={4} style={{ margin: 0 }}>
              {title}
            </Title>
          </Flex>

          {FixedHeader}
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
          {ScrollableContent}
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
          {FixedFooter}
        </Flex>
      </Flex>
    );
  },
);
