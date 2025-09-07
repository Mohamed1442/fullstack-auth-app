let accessToken: string | null = null;
let refreshToken: string | null = null;

export const tokenManager = {
  getAccessToken: () => accessToken,
  setAccessToken: (token: string) => {
    accessToken = token;
  },
  clearAccessToken: () => {
    accessToken = null;
  },

  getRefreshToken: () => refreshToken,
  setRefreshToken: (token: string) => {
    refreshToken = token;
  },
  clearRefreshToken: () => {
    refreshToken = null;
  },
};
