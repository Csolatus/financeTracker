import api from "./axiosInstance";

export const authApi = {
  login: async (username, password) => {
    const { data } = await api.post("/auth/login/", { username, password });
    return data; // { access, refresh }
  },

  register: async (username, email, password, passwordConfirm) => {
    const { data } = await api.post("/auth/register/", {
      username,
      email,
      password,
      password_confirm: passwordConfirm,
    });
    return data;
  },

  me: async () => {
    const { data } = await api.get("/auth/me/");
    return data; // { id, username, email, profile }
  },

  updateCurrency: async (currency) => {
    const { data } = await api.put("/auth/me/", { preferred_currency: currency });
    return data;
  },
};
