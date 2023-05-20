import { useEffect } from "react";
import { useRouter } from "next/router";

import { useAuthContext } from "@/contexts/AuthContext";


export default function App() {
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    router.push(user ? "/app/add-sale" : "/login");
  }, [user]);

  return null;
}
