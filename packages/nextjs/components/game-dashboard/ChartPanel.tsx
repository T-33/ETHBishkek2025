// nextjs/components/game-dashboard/ChartPanel.tsx
import React from "react";
import { LineChart } from "./LineChart";
import { PieChart } from "./PieChart";

interface Props {
  mintBurnData: any[]; // adapt types as you like
  distributionData: any[];
}

export const ChartPanel: React.FC<Props> = ({ mintBurnData, distributionData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <LineChart data={mintBurnData} title="Mint vs Burn over time" />
      <PieChart data={distributionData} title="Token distribution" />
    </div>
  );
};
