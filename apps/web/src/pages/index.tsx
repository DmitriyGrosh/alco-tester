import { reatomComponent } from "@reatom/react";
import { Layout } from "antd";
import { Header } from "../widgets";
import { Home } from "./home";
import { AllDrinks } from "./all-drinks";
import { TimelineDrinks } from "./timeline-drinks";

const { Content, Header: AntdHeader } = Layout;

export const Routes = reatomComponent(() => {
  return (
    <Layout style={{ height: "100vh" }}>
      <AntdHeader
        style={{
          padding: 0,
          background: "#fff",
          height: 48,
          borderBottom: "1px solid rgba(5, 5, 5, 0.06)",
        }}
      >
        <Header />
      </AntdHeader>
      <Content style={{ overflow: "hidden" }}>
        <Home />
        <AllDrinks />
        <TimelineDrinks />
      </Content>
    </Layout>
  );
});
