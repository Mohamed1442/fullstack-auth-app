import { EROUTES } from "@constants/routes";
import { Navigate, createBrowserRouter } from "react-router-dom";
import NotFound from "./NotFound";
import { authRoutes } from "./routes/auth.routes";
import { rootRoutes } from "./routes/root.routes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={EROUTES.ROOT} replace />,
  },
  rootRoutes,
  authRoutes,
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
