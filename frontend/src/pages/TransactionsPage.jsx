import { useState } from "react";
import { Plus, Download } from "lucide-react";
import { useTransactions } from "../hooks/useTransactions";
import { transactionsApi } from "../api/transactions";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import TransactionList from "../components/transactions/TransactionList";
import TransactionFilters from "../components/transactions/TransactionFilters";
import TransactionForm from "../components/transactions/TransactionForm";

const currentMonth = new Date().toISOString().slice(0, 7);

export default function TransactionsPage() {
  const [filters, setFilters]         = useState({ month: currentMonth });
  const [modalOpen, setModalOpen]     = useState(false);
  const [editTarget, setEditTarget]   = useState(null);

  const { transactions, count, loading, createTransaction, updateTransaction, removeTransaction } =
    useTransactions(filters);

  const openCreate = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit   = (t)  => { setEditTarget(t);   setModalOpen(true); };
  const closeModal = ()   => { setModalOpen(false); setEditTarget(null); };

  const handleSubmit = async (payload) => {
    if (editTarget) {
      await updateTransaction(editTarget.id, payload);
    } else {
      await createTransaction(payload);
    }
    closeModal();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette transaction ?")) return;
    await removeTransaction(id);
  };

  return (
    <div className="flex flex-col gap-6">

      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">{count} transaction{count !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => transactionsApi.exportCsv(filters).catch(() => alert("Erreur lors de l'export."))}>
            <Download size={15} />
            Exporter
          </Button>
          <Button onClick={openCreate}>
            <Plus size={15} />
            Ajouter
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <TransactionFilters filters={filters} onChange={setFilters} />

      {/* Liste */}
      <TransactionList
        transactions={transactions}
        loading={loading}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      {/* Modale création / édition */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editTarget ? "Modifier la transaction" : "Nouvelle transaction"}
      >
        <TransactionForm
          initial={editTarget}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>

    </div>
  );
}
