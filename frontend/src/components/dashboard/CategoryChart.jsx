import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#06b6d4"];

export default function CategoryChart({ data }) {
  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-400">
        Aucune dépense ce mois-ci.
      </div>
    );
  }

  const chartData = data.map((d) => ({ name: d.category, value: d.total }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={90}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => `${v.toFixed(2)} €`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
