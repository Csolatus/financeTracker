import { Trash2, Pencil, RefreshCw } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import CategoryBadge from "../categories/CategoryBadge";

const TYPE_STYLES = {
  INCOME:        { color: "text-green-600",  label: "Revenu"        },
  EXPENSE:       { color: "text-red-500",    label: "Dépense"       },
  SAVINGS:       { color: "text-blue-600",   label: "Épargne"       },
  REIMBURSEMENT: { color: "text-purple-600", label: "Remboursement" },
  TRANSFER:      { color: "text-orange-500", label: "Transfert"     },
};

export default function TransactionCard({ transaction, onEdit, onDelete }) {
  const { color, label } = TYPE_STYLES[transaction.transaction_type] || {};

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">

      {/* Infos principales */}
      <div className="flex items-center gap-4">
        <CategoryBadge category={transaction.category} />
        <div>
          <p className="text-sm font-medium text-gray-900">{transaction.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {formatDate(transaction.date)} · <span className={color}>{label}</span>
          </p>
        </div>
        {transaction.is_recurring && (
          <RefreshCw size={14} className="text-gray-400" title="Transaction récurrente" />
        )}
      </div>

      {/* Montant + actions */}
      <div className="flex items-center gap-4">
        <span className={`text-sm font-semibold ${color}`}>
          {formatCurrency(transaction.amount, transaction.currency)}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(transaction)}
            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(transaction.id)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

    </div>
  );
}
