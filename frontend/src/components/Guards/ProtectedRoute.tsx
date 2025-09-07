import type { ERole } from "@api/users/users.types";
import { EROUTES } from "@constants/routes";
import useRole from "@hooks/useRole";
import React from "react";
import { Navigate } from "react-router-dom";

type Props = {
  allowedRoles: ERole[];
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<Props> = ({ allowedRoles, children }) => {
  const hasRole = useRole(allowedRoles);

  if (!hasRole) return <Navigate to={EROUTES.ROOT} />;

  return children;
};

export default ProtectedRoute;
