import logo from "@/assets/logo.svg";
import type { FC, ReactNode } from "react";
import { ReactSVG } from "react-svg";

interface IAuthContainerProps {
  children: ReactNode;
  title: string;
}

const AuthContainer: FC<IAuthContainerProps> = ({ children, title }) => {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white p-11">
      <div className="relative flex w-full">
        <div className="mx-auto">
          <ReactSVG src={logo} />
        </div>
      </div>
      <div className="mb-2 mt-6 text-2xl font-semibold">{title}</div>
      {children}
    </div>
  );
};

export default AuthContainer;
