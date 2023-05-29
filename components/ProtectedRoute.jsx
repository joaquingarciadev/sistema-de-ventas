import { useRouter } from "next/router";

import { useAuthContext } from "@/contexts/AuthContext";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  if (loading) return <p>Cargando...</p>;

  if (!user) {
    router.push("/login");
    return <p>Redireccionando...</p>;
  }

  return <>{children}</>;
}
