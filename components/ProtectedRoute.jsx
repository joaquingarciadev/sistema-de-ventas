import { useRouter } from "next/router";

import { useAuthContext } from "@/contexts/AuthContext";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  if (loading) return <h1>Loading</h1>;

  if (!user) return router.push("/login");

  return <>{children}</>;
}
