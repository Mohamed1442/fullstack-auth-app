import { EROUTES } from "@constants/routes";
import AuthLayout from "@layouts/auth.layout";
import LoginPage from "@pages/auth/LoginPage";
import SignupPage from "@pages/auth/SignupPage";
import { Navigate, type RouteObject } from "react-router-dom";

export const authRoutes: RouteObject = {
  path: EROUTES.AUTH,
  element: <AuthLayout />,
  children: [
    {
      index: true,
      element: <Navigate to={EROUTES.LOGIN} />,
    },
    {
      path: EROUTES.LOGIN,
      element: <LoginPage />,
    },
    {
      path: EROUTES.SIGN_UP,
      element: <SignupPage />,
    },
  ],
};
