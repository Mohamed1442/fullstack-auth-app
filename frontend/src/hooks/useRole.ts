import { useCurrentUserInfo } from "@api/users/users.hooks";
import type { ERole } from "@api/users/users.types";

const useRole = (
  allowedRoles: ERole[]
): { isAllowed: boolean; isLoading: boolean } => {
  const { data: user, isLoading } = useCurrentUserInfo(); // cached user info instead of creating context

  return {
    isAllowed: user ? allowedRoles.includes(user.role) : false,
    isLoading,
  };
};

export default useRole;
