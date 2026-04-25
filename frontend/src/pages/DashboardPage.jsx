import { useDashboard } from "../hooks/useDashboard";
import { useAuth } from "../hooks/useAuth";
import { formatCurrency } from "../utils/formatCurrency";
import SummaryCard from "../components/dashboard/SummaryCard";
import CategoryChart from "../components/dashboard/CategoryChart";
import MonthlyChart from "../components/dashboard/MonthlyChart";

const MONTH_NAMES = [
  "", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

export default function DashboardPage() {
  const { user }              = useAuth();
  const { summary, loading }  = useDashboard();

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currency = user?.profile?.preferred_currency ?? "EUR";
  const totals   = summary?.totals ?? {};
  const period   = summary?.period;

  return (
    <div className="flex flex-col gap-8">

      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        {period && (
          <p className="text-sm text-gray-500 mt-1">
            {MONTH_NAMES[period.month]} {period.year}
          </p>
        )}
      </div>

      {/* Cartes de résumé */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          label="Revenus"
          value={formatCurrency(totals.INCOME ?? 0, currency)}
          color="text-green-600"
        />
        <SummaryCard
          label="Dépenses"
          value={formatCurrency(totals.EXPENSE ?? 0, currency)}
          color="text-red-500"
        />
        <SummaryCard
          label="Épargne"
          value={formatCurrency(totals.SAVINGS ?? 0, currency)}
          color="text-blue-600"
        />
        <SummaryCard
          label="Solde net"
          value={formatCurrency(summary?.balance ?? 0, currency)}
          color={summary?.balance >= 0 ? "text-green-600" : "text-red-500"}
          sub="Revenus − Dépenses"
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Dépenses par catégorie</h2>
          <CategoryChart data={summary?.expenses_by_category} />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Évolution mensuelle</h2>
          <MonthlyChart data={summary?.monthly_evolution} />
        </div>
      </div>

    </div>
  );
}
