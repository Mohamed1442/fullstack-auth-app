import logo from "@/assets/logo.svg";
import MainButton from "@components/MainButton/MainButton";
import type { FC, ReactNode } from "react";
import { HiChevronLeft } from "react-icons/hi2";
import { ReactSVG } from "react-svg";

interface IAuthContainerProps {
  children: ReactNode;
  title: string;
  description?: string;
  backTo?: any;
}

const AuthContainer: FC<IAuthContainerProps> = ({
  title,
  description,
  children,
  backTo = undefined,
}) => {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white p-11">
      <div className="relative flex w-full">
        {backTo ? (
          <MainButton
            variant="ghost"
            className="absolute left-0 p-0"
            size="xs"
            onClick={backTo}
          >
            <HiChevronLeft />
            Back
          </MainButton>
        ) : null}
        <div className="mx-auto">
          <ReactSVG src={logo} />
        </div>
      </div>
      <div className="mb-2 mt-6 text-2xl font-semibold">{title}</div>
      {description ? <div className="mb-9">{description}</div> : null}
      {children}
    </div>
  );
};

export default AuthContainer;
