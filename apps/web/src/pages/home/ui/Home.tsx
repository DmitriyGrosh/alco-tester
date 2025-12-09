import { reatomComponent } from "@reatom/react";
import { Card, Typography, Space } from "antd";
import { AlcoForm } from "../../../features/alco-form";

const { Title, Text } = Typography;

export const Home = reatomComponent(
    () => {
        return (
            <div style={{ 
                minHeight: "100vh", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                padding: "20px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            }}>
                <Card 
                    style={{ 
                        maxWidth: 500, 
                        width: "100%",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)"
                    }}
                >
                    <Space direction="vertical" size="large" style={{ width: "100%" }}>
                        <div style={{ textAlign: "center" }}>
                            <Title level={2} style={{ marginBottom: 8 }}>
                                Welcome to Alco Tester
                            </Title>
                            <Text type="secondary">
                                Enter the amount of alcohol you've consumed to get started
                            </Text>
                        </div>
                        <AlcoForm />
                    </Space>
                </Card>
            </div>
        );
    }
);