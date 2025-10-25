"use client";

import React from "react";
import { ActivityHeatmapData } from "~~/hooks/game/useAdvancedAnalytics";

interface ActivityHeatmapProps {
  data: ActivityHeatmapData[];
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const ActivityHeatmap = ({ data }: ActivityHeatmapProps) => {
  // Find max count for color scaling
  const maxCount = Math.max(...data.map(d => d.count), 1);

  // Get color based on count
  const getColor = (count: number) => {
    if (count === 0) return "bg-gray-800";
    const intensity = Math.min(count / maxCount, 1);
    if (intensity < 0.2) return "bg-blue-900/30";
    if (intensity < 0.4) return "bg-blue-700/50";
    if (intensity < 0.6) return "bg-blue-600/70";
    if (intensity < 0.8) return "bg-blue-500/90";
    return "bg-blue-400";
  };

  // Group data by day and hour
  const heatmapData: { [key: string]: number } = {};
  data.forEach(item => {
    const key = `${item.day}-${item.hour}`;
    heatmapData[key] = item.count;
  });

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border-2 border-gray-700 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">🔥 Activity Heatmap</h2>
      <p className="text-sm text-gray-400 mb-4">Lootbox openings by day of week and hour (UTC)</p>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Hour labels (top) */}
          <div className="flex mb-2">
            <div className="w-12"></div>
            {HOURS.map(hour => (
              <div key={hour} className="w-6 text-center text-xs text-gray-400">
                {hour % 6 === 0 ? hour : ""}
              </div>
            ))}
          </div>

          {/* Days and cells */}
          {DAYS.map((day, dayIndex) => (
            <div key={day} className="flex mb-1">
              {/* Day label */}
              <div className="w-12 text-sm text-gray-400 flex items-center">{day}</div>

              {/* Hour cells */}
              <div className="flex gap-1">
                {HOURS.map(hour => {
                  const count = heatmapData[`${dayIndex}-${hour}`] || 0;
                  const color = getColor(count);

                  return (
                    <div
                      key={hour}
                      className={`w-6 h-6 ${color} rounded-sm transition-all hover:scale-110 hover:ring-2 hover:ring-blue-400 cursor-pointer relative group`}
                      title={`${day} ${hour}:00 - ${count} openings`}
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                        <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap border border-gray-700">
                          {day} {hour}:00
                          <br />
                          {count} openings
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-400">Activity Level:</div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Low</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 bg-gray-800 rounded-sm"></div>
            <div className="w-4 h-4 bg-blue-900/30 rounded-sm"></div>
            <div className="w-4 h-4 bg-blue-700/50 rounded-sm"></div>
            <div className="w-4 h-4 bg-blue-600/70 rounded-sm"></div>
            <div className="w-4 h-4 bg-blue-500/90 rounded-sm"></div>
            <div className="w-4 h-4 bg-blue-400 rounded-sm"></div>
          </div>
          <span className="text-xs text-gray-400">High</span>
        </div>
      </div>

      {/* Peak Hours */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <h3 className="text-lg font-bold text-white mb-3">📊 Peak Activity</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Busiest Hour</p>
            <p className="text-2xl font-bold text-blue-400">
              {data.length > 0
                ? `${data.reduce((max, d) => (d.count > max.count ? d : max), data[0]).hour}:00 UTC`
                : "N/A"}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Busiest Day</p>
            <p className="text-2xl font-bold text-blue-400">
              {data.length > 0 ? DAYS[data.reduce((max, d) => (d.count > max.count ? d : max), data[0]).day] : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
