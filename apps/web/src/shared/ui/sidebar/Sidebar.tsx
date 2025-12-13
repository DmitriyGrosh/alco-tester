import { reatomComponent } from "@reatom/react";
import { Drawer, Layout } from "antd";
import { useEffect, useState, type ReactNode } from "react";

const { Sider, Content } = Layout;

interface SidebarProps {
  children: ReactNode;
  sidebar: ReactNode;
  isDrawer: boolean;
  onClose: () => void;
}

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
};

export const Sidebar = reatomComponent<SidebarProps>(
  ({ children, sidebar, isDrawer, onClose }) => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    console.log("isMobile", isMobile);

    return (
      <Layout style={{ height: "100%", background: "transparent" }}>
        <Content style={{ height: "100%", overflowY: "auto" }}>
          {children}
        </Content>
        {sidebar &&
          (isMobile ? (
            <Drawer
              open={isDrawer}
              onClose={onClose}
              width={isMobile ? "100%" : 400}
              styles={{ body: { padding: 0 } }}
            >
              {sidebar}
            </Drawer>
          ) : (
            <Sider
              width={300}
              theme="light"
              style={{
                borderLeft: "1px solid rgba(5, 5, 5, 0.06)",
                height: "100%",
                overflowY: "auto",
                padding: 16,
              }}
            >
              {sidebar}
            </Sider>
          ))}
      </Layout>
    );
  },
);
