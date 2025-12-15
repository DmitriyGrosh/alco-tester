import { reatomComponent } from "@reatom/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, Typography } from "antd";
import dayjs from "dayjs";
import { useBehavior } from "../model";

export const DrinksChart = reatomComponent(() => {
  const { adeResult } = useBehavior();
  const data = adeResult();
  console.log("data", adeResult());

  if (!data || data.length === 0) {
    return null;
  }

  // Find max value to set domain
  const maxPermille = Math.max(...data.map((d) => d.permille));
  console.log("maxPermille", maxPermille);

  return (
    <Card title="Intoxication Timeline" style={{ marginTop: 24 }}>
      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => dayjs(date).format("HH:mm")}
              minTickGap={30}
            />
            <YAxis domain={[0, (dataMax: number) => Math.max(dataMax, 0.5)]} />
            <Tooltip
              labelFormatter={(date) => dayjs(date).format("HH:mm")}
              formatter={(value: number) => [
                `${value.toFixed(2)}‰`,
                "Alcohol Level",
              ]}
            />
            <Area
              type="monotone"
              dataKey="permille"
              stroke="#1890ff"
              fill="#1890ff"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <Typography.Text
        type="secondary"
        style={{ marginTop: 16, display: "block" }}
      >
        * This is an estimation based on the Widmark formula. Individual results
        may vary.
      </Typography.Text>
    </Card>
  );
});
