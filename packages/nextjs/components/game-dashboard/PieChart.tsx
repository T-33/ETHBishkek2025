"use client";

import React from "react";
import { Cell, Legend, Pie, PieChart as RCPie, ResponsiveContainer, Tooltip } from "recharts";

interface Item {
  name: string;
  value: number;
  [key: string]: number | string;
}

interface Props {
  data: Item[];
  title?: string;
}

const COLORS = ["#3B82F6", "#A78BFA", "#34D399", "#F97316"];

export const PieChart: React.FC<Props> = ({ data, title }) => {
  return (
    <div className="bg-[#151A22] p-4 rounded-xl shadow">
      {title && <div className="text-sm text-gray-400 mb-2">{title}</div>}
      <ResponsiveContainer width="100%" height={260}>
        <RCPie>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} fill="#8884d8" label />
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
          <Tooltip />
          <Legend />
        </RCPie>
      </ResponsiveContainer>
    </div>
  );
};
