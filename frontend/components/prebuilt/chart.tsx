import React from "react";
import { format, parseISO } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis
} from "recharts";
import { DarkCharcoal, Gray, Green, Pink, White } from "@/styles/colors";

type Props = {
  data: ChartData[];
};

interface ChartData {
  value: number;
  date: string;
  date_label?: string;
}

export const Chart: React.FC<Props> = ({ data }) => {
  console.log("chartData: " , data)

  if (data.length === 0) {
    return <div/>;
  }

  const startValue = data[0].value;
  const endValue = data[data.length - 1].value;
  const maxValue = Math.max(startValue, endValue, startValue);
  const minValue = Math.min(startValue, endValue, startValue);

  const color = endValue > startValue ? Green : Pink;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart className="ml-n2" data={data}>
        <Area
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={White}
        />

        <XAxis
          dataKey='date_label'
          axisLine={false}
          tickLine={false}
          tickFormatter={str => {
            if (str === "09:30 AM" || str === "12 PM" || str === "3 PM") {
              return str;
            }
            const date = parseISO(str);
            if (date.getDate() % 7 === 0) {
              return format(date, "MMM, d");
            }
            return "";
          }}
        />

        <YAxis
          dataKey="value"
          width={20}
          axisLine={false}
          tickLine={false}
          tick={false}
          domain={[minValue - getDomainBuffer(minValue), maxValue + getDomainBuffer(maxValue)]}
        />

        <ReferenceLine y={startValue} stroke={Gray} strokeDasharray="1 3"/>
        <Tooltip content={<CustomTooltip/>}/>

        <CartesianGrid opacity={0.1} vertical={false}/>

      </AreaChart>
    </ResponsiveContainer>
  );
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="stock-tooltip">
        <div className="row mx-1">
          <span className="label" color={DarkCharcoal} style={{ fontWeight: "bold" }}>${`${payload[0].value}`}</span>
          <span className="ml-2" color={Gray}>{`${payload[0].payload.date}`}</span>
        </div>
      </div>
    );
  }
  return null;
};

export const getDomainBuffer = (maxValue: number) => {
  if (maxValue >= 100000) {
    return 1000;
  }
  if (maxValue >= 100000) {
    return 10;
  }

  if (maxValue >= 1000) {
    return 1
  }
  return .1;
};
