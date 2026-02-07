import { useEffect } from "react";
import { useRouter } from "next/router";
import useAdminSession from "./useAdminSession";

const useAdminGuard = () => {
  const router = useRouter();
  const { session, loading } = useAdminSession();

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/admin/login");
    }
  }, [loading, session, router]);

  return { session, loading };
};

export default useAdminGuard;
