import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { transactionsApi } from "../api/transactions";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDate } from "../utils/formatDate";
import CategoryBadge from "../components/categories/CategoryBadge";
import Button from "../components/common/Button";

export default function TransactionDetailPage() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [t, setT]  = useState(null);

  useEffect(() => {
    transactionsApi.get(id).then(setT).catch(() => navigate("/transactions"));
  }, [id, navigate]);

  if (!t) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 -ml-2">
        ← Retour
      </Button>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <CategoryBadge category={t.category} />
          <div>
            <h1 className="text-xl font-bold text-gray-900">{t.title}</h1>
            <p className="text-sm text-gray-400">{t.category?.name}</p>
          </div>
        </div>

        <p className="text-3xl font-bold text-gray-900">
          {formatCurrency(t.amount, t.currency)}
        </p>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div><dt className="text-gray-400">Type</dt>        <dd className="font-medium text-gray-900">{t.transaction_type}</dd></div>
          <div><dt className="text-gray-400">Date</dt>        <dd className="font-medium text-gray-900">{formatDate(t.date)}</dd></div>
          <div><dt className="text-gray-400">Devise</dt>      <dd className="font-medium text-gray-900">{t.currency}</dd></div>
          <div><dt className="text-gray-400">Récurrent</dt>   <dd className="font-medium text-gray-900">{t.is_recurring ? t.recurrence_frequency : "Non"}</dd></div>
        </dl>

        {t.notes && (
          <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{t.notes}</div>
        )}
      </div>
    </div>
  );
}
