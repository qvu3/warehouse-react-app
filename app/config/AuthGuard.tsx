import { useEffect } from "react";
import { useRouter, usePathname } from "expo-router";
import { useAuth } from "./AuthContext";

const PUBLIC_ROUTES = ["/", "/login", "/register"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
        router.replace("/login");
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, pathname]);

  return <>{children}</>;
}
