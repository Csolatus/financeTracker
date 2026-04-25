import api from "./axiosInstance";

export const dashboardApi = {
  summary: async () => {
    const { data } = await api.get("/dashboard/summary/");
    return data;
    // {
    //   period: { year, month },
    //   totals: { INCOME, EXPENSE, … },
    //   balance: 1300.0,
    //   expenses_by_category: [{ category, icon, total }, …],
    //   monthly_evolution: [{ month, INCOME, EXPENSE, … }, …],
    // }
  },
};
