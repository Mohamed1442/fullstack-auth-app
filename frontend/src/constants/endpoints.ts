export const authEndpoints = {
  register: "/auth/register",
  login: "/auth/login",
  logout: "/auth/logout",
  refreshToken: "/auth/refresh-access-token",
};

export const usersEndpoints = {
  admin: {
    users: "/admin/users",
  },
  profile: "/users/info",
};
