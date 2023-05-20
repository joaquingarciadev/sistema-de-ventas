import { useEffect, useContext } from "react";
import { useRouter } from "next/router";

import { useAuthContext } from "@/contexts/AuthContext";

export default function Home() {
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    router.push(user ? "/app/add-sale" : "/login");
  }, [user]);

  return null;
}
