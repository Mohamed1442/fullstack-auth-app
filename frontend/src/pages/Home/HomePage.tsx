import type { ICustomAxiosError } from "@api/api";
import { logoutApi } from "@api/auth/auth.api";
import { ERole } from "@api/users/users.types";
import ProtectedComponent from "@components/Guards/ProtectedComponent";
import MainButton from "@components/MainButton/MainButton";
import { EROUTES } from "@constants/routes";
import { useQueryClient } from "@tanstack/react-query";
import { tokenManager } from "@utils/tokenManager";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logoutHandling = async () => {
    try {
      setIsLoading(true);
      await logoutApi();
    } catch (error) {
      toast.error(
        (error as ICustomAxiosError).response?.data?.error?.message[0]
      );
    } finally {
      setIsLoading(false);
      tokenManager.clearAccessToken();
      tokenManager.clearRefreshToken();
      queryClient.invalidateQueries();
      navigate(EROUTES.AUTH);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-secondary flex-col">
      <h2 className="text-4xl text-center font-bold text-gray-800">
        Welcome to the application.
      </h2>

      <div className="flex flex-col gap-4 justify-center mt-32">
        <MainButton onClick={() => navigate(EROUTES.PROFILE)}>
          Profile
        </MainButton>
        <ProtectedComponent allowerdRoles={[ERole.ADMIN]}>
          <MainButton onClick={() => navigate(EROUTES.USERS)}>
            View System Users
          </MainButton>
        </ProtectedComponent>
        <MainButton
          loading={isLoading}
          variant="danger"
          onClick={logoutHandling}
        >
          Logout
        </MainButton>
      </div>
    </div>
  );
};

export default HomePage;
