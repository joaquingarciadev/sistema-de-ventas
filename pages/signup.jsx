import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useAuthContext } from "@/contexts/AuthContext";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { user, signup } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/app/add-sale");
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form.email, form.password);
      router.push("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="card auth">
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Ejemplo"
            value={form.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            id="email"
            placeholder="ejemplo@ejemplo.com"
            value={form.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            name="password"
            id="password"
            placeholder="********"
            value={form.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Regístrate</button>
      </form>
    </div>
  );
}
