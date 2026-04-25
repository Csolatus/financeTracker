import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

export default function MonthlyChart({ data }) {
  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-400">
        Pas encore de données.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip formatter={(v) => `${v.toFixed(2)} €`} />
        <Legend />
        <Area type="monotone" dataKey="INCOME" name="Revenus"
          stroke="#10b981" fill="url(#income)" strokeWidth={2} />
        <Area type="monotone" dataKey="EXPENSE" name="Dépenses"
          stroke="#ef4444" fill="url(#expense)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
