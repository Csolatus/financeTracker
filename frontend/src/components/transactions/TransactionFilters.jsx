import { useEffect, useState } from "react";
import { categoriesApi } from "../../api/categories";

const TRANSACTION_TYPES = [
  { value: "",              label: "Tous les types"  },
  { value: "INCOME",        label: "Revenu"          },
  { value: "EXPENSE",       label: "Dépense"         },
  { value: "SAVINGS",       label: "Épargne"         },
  { value: "REIMBURSEMENT", label: "Remboursement"   },
  { value: "TRANSFER",      label: "Transfert"       },
];

export default function TransactionFilters({ filters, onChange }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoriesApi.list().then(setCategories);
  }, []);

  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  // Mois courant au format YYYY-MM comme valeur par défaut
  const currentMonth = new Date().toISOString().slice(0, 7);

  return (
    <div className="flex flex-wrap gap-3">

      {/* Filtre par mois */}
      <input
        type="month"
        value={filters.month || currentMonth}
        onChange={(e) => handleChange("month", e.target.value)}
        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Filtre par catégorie */}
      <select
        value={filters.category || ""}
        onChange={(e) => handleChange("category", e.target.value)}
        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Toutes les catégories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {/* Filtre par type */}
      <select
        value={filters.transaction_type || ""}
        onChange={(e) => handleChange("transaction_type", e.target.value)}
        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {TRANSACTION_TYPES.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>

    </div>
  );
}
