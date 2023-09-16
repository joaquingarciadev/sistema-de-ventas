import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Evita redirección durante la carga inicial

    if (!user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  return <>{children}</>;
}
