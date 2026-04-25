import { useState, useEffect, useCallback } from "react";
import { transactionsApi } from "../api/transactions";

export function useTransactions(filters = {}) {
  const [transactions, setTransactions] = useState([]);
  const [count, setCount]               = useState(0);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await transactionsApi.list(filters);
      setTransactions(data.results);
      setCount(data.count);
    } catch (err) {
      setError("Impossible de charger les transactions.");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const createTransaction = async (payload) => {
    const newTransaction = await transactionsApi.create(payload);
    setTransactions((prev) => [newTransaction, ...prev]);
    setCount((prev) => prev + 1);
    return newTransaction;
  };

  const updateTransaction = async (id, payload) => {
    const updated = await transactionsApi.update(id, payload);
    setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  const removeTransaction = async (id) => {
    await transactionsApi.remove(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    setCount((prev) => prev - 1);
  };

  return {
    transactions,
    count,
    loading,
    error,
    refetch: fetchTransactions,
    createTransaction,
    updateTransaction,
    removeTransaction,
  };
}
