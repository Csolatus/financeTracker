import { useState, useEffect } from "react";
import { dashboardApi } from "../api/dashboard";

export function useDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    dashboardApi.summary()
      .then((data) => setSummary(data))
      .catch(() => setError("Impossible de charger le résumé."))
      .finally(() => setLoading(false));
  }, []);

  return { summary, loading, error };
}
