import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm]       = useState({ username: "", email: "", password: "", password_confirm: "" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await authApi.register(form.username, form.email, form.password, form.password_confirm);
      navigate("/login");
    } catch (err) {
      // Le backend renvoie un objet { field: ["message"] }
      setErrors(err.response?.data ?? { non_field_errors: ["Une erreur est survenue."] });
    } finally {
      setLoading(false);
    }
  };

  const fieldError = (key) => errors[key]?.[0];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-sm p-8">

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Inscription</h1>
        <p className="text-sm text-gray-500 mb-6">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">Se connecter</Link>
        </p>

        {fieldError("non_field_errors") && (
          <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {fieldError("non_field_errors")}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Nom d'utilisateur"
            value={form.username}
            onChange={(e) => set("username", e.target.value)}
            error={fieldError("username")}
            autoFocus
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            error={fieldError("email")}
          />
          <Input
            label="Mot de passe"
            type="password"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            error={fieldError("password")}
          />
          <Input
            label="Confirmer le mot de passe"
            type="password"
            value={form.password_confirm}
            onChange={(e) => set("password_confirm", e.target.value)}
            error={fieldError("password_confirm")}
          />
          <Button type="submit" loading={loading} className="mt-2 w-full">
            Créer mon compte
          </Button>
        </form>

      </div>
    </div>
  );
}
