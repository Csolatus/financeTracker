import api from "./axiosInstance";

export const categoriesApi = {
  list: async () => {
    const { data } = await api.get("/categories/");
    // Gère les deux cas : réponse paginée { results: [] } ou tableau direct []
    return Array.isArray(data) ? data : data.results;
  },
};
