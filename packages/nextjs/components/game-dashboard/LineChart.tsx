"use client";

import React from "react";
import { CartesianGrid, Legend, Line, LineChart as RCLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Point {
  time: string | number;
  mint: number;
  burn: number;
}
interface Props {
  data: Point[];
  title?: string;
}

export const LineChart: React.FC<Props> = ({ data, title }) => {
  return (
    <div className="bg-[#151A22] p-4 rounded-xl shadow">
      {title && <div className="text-sm text-gray-400 mb-2">{title}</div>}
      <ResponsiveContainer width="100%" height={260}>
        <RCLine data={data}>
          <CartesianGrid stroke="#111827" />
          <XAxis dataKey="time" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="mint" stroke="#3B82F6" dot={false} />
          <Line type="monotone" dataKey="burn" stroke="#A78BFA" dot={false} />
        </RCLine>
      </ResponsiveContainer>
    </div>
  );
};
