import api from "./axiosInstance";

export const transactionsApi = {
  list: async (params = {}) => {
    // params : { month, category, transaction_type, ordering, page }
    const { data } = await api.get("/transactions/", { params });
    return data; // { count, next, previous, results: […] }
  },

  get: async (id) => {
    const { data } = await api.get(`/transactions/${id}/`);
    return data;
  },

  create: async (payload) => {
    const { data } = await api.post("/transactions/", payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await api.put(`/transactions/${id}/`, payload);
    return data;
  },

  patch: async (id, payload) => {
    const { data } = await api.patch(`/transactions/${id}/`, payload);
    return data;
  },

  remove: async (id) => {
    await api.delete(`/transactions/${id}/`);
  },

  exportCsv: async (params = {}) => {
    const response = await api.get("/transactions/export/", {
      params,
      responseType: "blob", // on récupère le fichier brut, pas du JSON
    });
    // Crée un lien temporaire pour déclencher le téléchargement
    const url  = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href  = url;
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },
};
