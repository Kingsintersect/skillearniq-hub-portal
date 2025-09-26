'use client'

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface PerformanceTrendChartProps {
  data: Array<{
    period: string;
    average: number;
    submissions: number;
  }>;
}

export const PerformanceTrendChart: React.FC<PerformanceTrendChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="average"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.3}
          name="Average Score"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="submissions"
          stroke="#82ca9d"
          name="Submissions"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};