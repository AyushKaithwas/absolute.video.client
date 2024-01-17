import { useAuth } from "@/auth/context/auth-provider";
import Layout from "@/components/layout";
import Container from "@/components/ui/container";
import { useRouter } from "@/hooks/useRouter";
import { paths } from "@/router";
import React from "react";

function Logout() {
  const { logout } = useAuth();
  const { replace } = useRouter();
  React.useEffect(() => {
    logout();
    replace(paths.home);
  }, [logout, replace]);
  return (
    <Container>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-2xl font-bold">Logging out...</h1>
      </div>
    </Container>
  );
}

export default Logout;
