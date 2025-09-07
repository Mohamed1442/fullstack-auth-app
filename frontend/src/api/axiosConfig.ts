import router from "@routers/index";
import { tokenManager } from "@utils/tokenManager";
import envConfigKeys from "@constants/envConfig";
import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { refreshTokenApi } from "./auth/auth.api";

interface FailedRequest {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

// Helper function to process queued requests
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const axiosInstance = axios.create({
  baseURL: envConfigKeys.base_url,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const accessToken = tokenManager.getAccessToken();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async (error: AxiosError): Promise<AxiosResponse | AxiosError> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshToken = tokenManager.getRefreshToken();

          if (!refreshToken) {
            throw new Error("No refresh token found");
          }

          const data = await refreshTokenApi();

          // Update tokens in tokenManager
          tokenManager.setAccessToken(data.accessToken);
          tokenManager.setRefreshToken(data.refreshToken);

          processQueue(null, data.accessToken);
          isRefreshing = false;

          // Retry the original request with the new access token
          if (originalRequest.headers) {
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${data.accessToken}`;
          }
          return axiosInstance(originalRequest);
        } catch (err) {
          processQueue(err, null);
          isRefreshing = false;

          // Clear tokens  from memory and redirect to login on failure
          tokenManager.clearAccessToken();
          tokenManager.clearRefreshToken();
          router.navigate("/auth");
          return Promise.reject(err);
        }
      }

      // Queue failed requests while token is being refreshed
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
          }
          return axiosInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
