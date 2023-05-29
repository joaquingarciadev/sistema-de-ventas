import { useRouter } from "next/router";

import "@/styles/globals.css";
import Layout from "@/components/Layout";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <AuthProvider>
      {router.pathname.includes("/app") ? (
        <ProtectedRoute>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ProtectedRoute>
      ) : (
        <Component {...pageProps} />
      )}
    </AuthProvider>
  );
}
