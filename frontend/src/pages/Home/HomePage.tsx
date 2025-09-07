import { logoutApi } from "@api/auth/auth.api";
import { ERole } from "@api/users/users.types";
import ProtectedComponent from "@components/Guards/ProtectedComponent";
import MainButton from "@components/MainButton/MainButton";
import { EROUTES } from "@constants/routes";
import { tokenManager } from "@utils/tokenManager";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const logoutHandling = async () => {
    await logoutApi();
    tokenManager.clearAccessToken();
    tokenManager.clearRefreshToken();
    navigate(EROUTES.AUTH);
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
        <MainButton variant="danger" onClick={logoutHandling}>
          Logout
        </MainButton>
      </div>
    </div>
  );
};

export default HomePage;
