import { EROUTES } from "@constants/routes";
import { tokenManager } from "@utils/tokenManager";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function RootLayout() {
  const { pathname } = useLocation();

  const isNotAuthenticated =
    !tokenManager.getAccessToken() && !pathname.includes(`${EROUTES.AUTH}`);

  if (isNotAuthenticated) {
    return <Navigate to={EROUTES.AUTH} />;
  }

  return <Outlet />;
}

export default RootLayout;
