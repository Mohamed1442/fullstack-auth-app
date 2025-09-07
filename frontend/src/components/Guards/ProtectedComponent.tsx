import type { ERole } from "@api/users/users.types";
import useRole from "@hooks/useRole";
import { memo } from "react";

interface IProtectedComponentProps {
  allowerdRoles: ERole[];
  children: React.ReactNode;
}

const ProtectedComponent: React.FC<IProtectedComponentProps> = ({
  allowerdRoles,
  children,
}) => {
  const hasRole = useRole(allowerdRoles);

  if (!hasRole) return null;
  return children;
};

export default memo(ProtectedComponent);
