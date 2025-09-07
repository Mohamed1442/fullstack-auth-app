import { ERole } from "@api/users/users.types";
import ProtectedRoute from "@components/Guards/ProtectedRoute";
import { EROUTES } from "@constants/routes";
import RootLayout from "@layouts/root.layout";
import HomePage from "@pages/Home/HomePage";
import ProfilePage from "@pages/users/ProfilePage";
import UsersListPage from "@pages/users/UsersListPage";
import { type RouteObject } from "react-router-dom";

export const rootRoutes: RouteObject = {
  path: EROUTES.ROOT,
  element: <RootLayout />,
  children: [
    { index: true, element: <HomePage /> },
    {
      path: EROUTES.PROFILE,
      element: <ProfilePage />,
    },
    {
      path: EROUTES.USERS,
      element: (
        <ProtectedRoute allowedRoles={[ERole.ADMIN]}>
          <UsersListPage />
        </ProtectedRoute>
      ),
    },
  ],
};
