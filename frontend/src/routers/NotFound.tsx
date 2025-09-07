import MainButton from "@components/MainButton/MainButton";
import { EROUTES } from "@constants/routes";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-16 flex flex-col items-center justify-center gap-4">
      <div className="text-5xl font-bold">Page Not Found</div>
      <div className="text-xl text-[#808693]">
        The page you are looking for does not exist
      </div>
      <MainButton onClick={() => navigate(EROUTES.ROOT)}>Go to Home</MainButton>
    </div>
  );
};

export default NotFound;
