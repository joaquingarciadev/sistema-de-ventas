import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { useAuthContext } from "@/contexts/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { user, login, loginWithGoogle } = useAuthContext();
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
      await login(form.email, form.password);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="card auth">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
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
        <div>
          <p>
            ¿No tienes cuenta?{" "}
            <b>
              <Link href="/signup">Regístrate</Link>
            </b>
          </p>
        </div>
        <div className="col-group">
          <button type="submit">Iniciar sesión</button>
          <button type="button" className="btn-social" onClick={handleGoogleSignin}>
            <i className="fab fa-google"></i> &nbsp; Iniciar sesión con Google
          </button>
        </div>
      </form>
    </div>
  );
}
