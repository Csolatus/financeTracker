import { useEffect, useState } from "react";
import { categoriesApi } from "../../api/categories";
import Button from "../common/Button";
import Input from "../common/Input";

const TYPES = [
  { value: "INCOME",        label: "Revenu"        },
  { value: "EXPENSE",       label: "Dépense"       },
  { value: "SAVINGS",       label: "Épargne"       },
  { value: "REIMBURSEMENT", label: "Remboursement" },
  { value: "TRANSFER",      label: "Transfert"     },
];

const CURRENCIES = ["EUR", "USD", "GBP", "CHF", "CAD", "JPY"];

const FREQUENCIES = [
  { value: "DAILY",   label: "Quotidien"    },
  { value: "WEEKLY",  label: "Hebdomadaire" },
  { value: "MONTHLY", label: "Mensuel"      },
  { value: "YEARLY",  label: "Annuel"       },
];

const EMPTY_FORM = {
  title: "", amount: "", currency: "EUR",
  transaction_type: "EXPENSE", date: new Date().toISOString().slice(0, 10),
  category_id: "", is_recurring: false, recurrence_frequency: "", notes: "",
};

export default function TransactionForm({ initial = null, onSubmit, onCancel }) {
  const [form, setForm]           = useState(initial ? {
    ...initial,
    category_id: initial.category?.id ?? "",
  } : EMPTY_FORM);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors]         = useState({});
  const [loading, setLoading]       = useState(false);

  useEffect(() => {
    categoriesApi.list().then(setCategories);
  }, []);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const e = {};
    if (!form.title.trim())        e.title       = "Le titre est requis.";
    if (!form.amount || form.amount <= 0) e.amount = "Le montant doit être positif.";
    if (!form.date)                e.date        = "La date est requise.";
    if (!form.category_id)         e.category_id = "La catégorie est requise.";
    if (form.is_recurring && !form.recurrence_frequency)
      e.recurrence_frequency = "La fréquence est requise.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    try {
      await onSubmit({
        ...form,
        amount: parseFloat(form.amount),
        recurrence_frequency: form.is_recurring ? form.recurrence_frequency : null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      <Input label="Titre" value={form.title}
        onChange={(e) => set("title", e.target.value)} error={errors.title} />

      <div className="grid grid-cols-2 gap-3">
        <Input label="Montant" type="number" min="0.01" step="0.01"
          value={form.amount} onChange={(e) => set("amount", e.target.value)}
          error={errors.amount} />

        {/* Devise */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Devise</label>
          <select value={form.currency} onChange={(e) => set("currency", e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Type */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Type</label>
          <select value={form.transaction_type} onChange={(e) => set("transaction_type", e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <Input label="Date" type="date" value={form.date}
          onChange={(e) => set("date", e.target.value)} error={errors.date} />
      </div>

      {/* Catégorie */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Catégorie</label>
        <select value={form.category_id} onChange={(e) => set("category_id", e.target.value)}
          className={`px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
            ${errors.category_id ? "border-red-400 bg-red-50" : "border-gray-300"}`}>
          <option value="">Sélectionner…</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {errors.category_id && <span className="text-xs text-red-500">{errors.category_id}</span>}
      </div>

      {/* Récurrence */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
          <input type="checkbox" checked={form.is_recurring}
            onChange={(e) => set("is_recurring", e.target.checked)}
            className="rounded" />
          Transaction récurrente
        </label>

        {form.is_recurring && (
          <div className="flex flex-col gap-1">
            <select value={form.recurrence_frequency}
              onChange={(e) => set("recurrence_frequency", e.target.value)}
              className={`px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                ${errors.recurrence_frequency ? "border-red-400 bg-red-50" : "border-gray-300"}`}>
              <option value="">Fréquence…</option>
              {FREQUENCIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
            {errors.recurrence_frequency &&
              <span className="text-xs text-red-500">{errors.recurrence_frequency}</span>}
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Notes <span className="text-gray-400 font-normal">(optionnel)</span></label>
        <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={2}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Annuler</Button>
        <Button type="submit" loading={loading}>
          {initial ? "Modifier" : "Ajouter"}
        </Button>
      </div>

    </form>
  );
}
