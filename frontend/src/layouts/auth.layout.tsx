import { EROUTES } from "@constants/routes";
import { tokenManager } from "@utils/tokenManager";
import { refreshTokenApi } from "@api/auth/auth.api";
import MainLoader from "@components/MainLoader/MainLoader";
import { useEffect, useState, type FC } from "react";
import { Navigate, Outlet } from "react-router-dom";

const AuthLayout: FC = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    refreshTokenApi()
      .then((data) => {
        tokenManager.setAccessToken(data.accessToken);
        tokenManager.setRefreshToken(data.refreshToken);
      })
      .catch(() => {
        tokenManager.clearAccessToken();
        tokenManager.clearRefreshToken();
      })
      .finally(() => {
        setIsPageLoading(false);
      });
  }, []);

  if (!isPageLoading && tokenManager.getAccessToken()) {
    return <Navigate to={EROUTES.ROOT} />;
  }

  if (isPageLoading) {
    return <MainLoader />;
  }

  return (
    <div className="flex min-h-[100vh] flex-col items-center justify-center overflow-y-auto bg-secondary p-16">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
