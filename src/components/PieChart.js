import React from "react";
import { useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  LabelList,
  ResponsiveContainer,
} from "recharts";

const PieChartComp = ({
  data,
  width,
  height,
  dataKey,
  nameKey,
  cx,
  cy,
  outerRadius,
  colors,
}) => {
  //   const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#888888"];
  const renderLabel = useCallback((piePiece) => {
    return piePiece.name;
  }, []);

  // const renderCustomizedLabel = useCallback((piePiece) => {
  //   console.log(piePiece.value);
  //   return Number(piePiece.value);
  // }, []);

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        style={{ fontWeight: "normal", fontSize: "1.8rem" }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer
      width={width}
      height={height}
      style={{ marginLeft: "30%", fontSize: "2rem", fontWeight: "normal" }}
    >
      <PieChart width={width} height={height} style={{ cursor: "pointer" }}>
        <Pie
          data={data}
          // isAnimationActive={true}
          dataKey={dataKey && "value"}
          // nameKey={nameKey && "name"}
          cx={cx && "50%"}
          cy={cy && "50%"}
          outerRadius={outerRadius && 80}
          // fill={colors[0]}
          label={renderCustomizedLabel}
          labelLine={false}
          style={{ fontWeight: "bold", fontSize: "2rem" }}
          // margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          {/* <LabelList
            dataKey="value"
            position="top"
            content={renderCustomizedLabel}
            style={{ fontSize: "1.5rem", fontWeight: "lighter" }}
          /> */}
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip style={{ fontSize: "2rem", fontWeight: "lighter" }} />
        <Legend
          height={36}
          style={{ fontSize: "2rem", fontWeight: "lighter" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComp;
