import React from "react";

interface Props {
  title: string;
  value: number | string;
  color?: "blue" | "purple" | "green";
}

export const StatCard: React.FC<Props> = ({ title, value, color = "blue" }) => {
  const colorMap: Record<string, string> = {
    blue: "text-blue-400",
    purple: "text-purple-400",
    green: "text-green-400",
  };
  return (
    <div className="p-4 bg-[#151A22] rounded-xl shadow flex flex-col">
      <span className="text-gray-400 text-sm">{title}</span>
      <span className={`text-2xl font-bold ${colorMap[color]}`}>{value}</span>
    </div>
  );
};
