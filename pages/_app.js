import "@/styles/globals.css";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";

import Layout from "@/components/Layout";
import { AuthProvider } from "../contexts/AuthContext";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <AuthProvider>
      {router.pathname.includes("/app") ? (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <Component {...pageProps} />
      )}
    </AuthProvider>
  );
}
