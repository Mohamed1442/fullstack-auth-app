import type { ERole } from "@api/users/users.types";
import MainLoader from "@components/MainLoader/MainLoader";
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
  const { isAllowed, isLoading } = useRole(allowerdRoles);

  if (isLoading) return <MainLoader />;
  if (!isAllowed) return null;

  return children;
};

export default memo(ProtectedComponent);
