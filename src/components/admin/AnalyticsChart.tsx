"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { formatCurrency } from "@/lib/utils";

type AnalyticsChartProps = {
  data: any[];
};

export default function AnalyticsChart({ data }: AnalyticsChartProps) {
  const chartData = useMemo(() => {
    // Group orders by date and sum total
    const grouped = data.reduce((acc: any, order: any) => {
      const date = new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      });
      acc[date] = (acc[date] || 0) + order.total;
      return acc;
    }, {});

    // Fill in last 7 days including days with 0 sales
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      });
      result.push({
        date: dateStr,
        revenue: grouped[dateStr] || 0
      });
    }
    return result;
  }, [data]);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4A5D4F" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#4A5D4F" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#666' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#666' }} 
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip 
            contentStyle={{ 
                backgroundColor: '#fff', 
                borderRadius: '12px', 
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
            itemStyle={{ color: '#4A5D4F', fontSize: '12px', fontWeight: 600 }}
            formatter={(value: any) => [formatCurrency(Number(value || 0)), "Revenue"]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#4A5D4F"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
