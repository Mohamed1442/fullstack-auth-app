import type { ICustomAxiosError } from "@api/api";
import { useLogin } from "@api/auth/auth.hooks";
import type { ILoginRequest } from "@api/auth/auth.types";
import MainButton from "@components/MainButton/MainButton";
import MainInput from "@components/MainInput/MainInput";
import { EROUTES } from "@constants/routes";
import { yupResolver } from "@hookform/resolvers/yup";
import { tokenManager } from "@utils/tokenManager";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Za-z]/, "Password must contain at least one letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const { mutateAsync: login, isPending } = useLogin();
  const { handleSubmit, control } = useForm<ILoginRequest>({
    resolver: yupResolver(loginSchema),
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<ILoginRequest> = async (
    data: ILoginRequest
  ) => {
    try {
      const { accessToken, refreshToken } = await login(data);
      navigate(EROUTES.ROOT);

      tokenManager.setAccessToken(accessToken);
      tokenManager.setRefreshToken(refreshToken);

      toast.success("Welcome!");
    } catch (error) {
      toast.error(
        (error as ICustomAxiosError).response?.data?.error?.message[0] ||
          "Login failed"
      );
    }
  };

  return (
    <form className="w-[363px] mt-20" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex w-full flex-col gap-5">
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }): React.ReactElement => (
            <MainInput
              label="Email"
              type="string"
              error={fieldState?.error?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }): React.ReactElement => (
            <MainInput
              label="Password"
              type="password"
              error={fieldState?.error?.message}
              {...field}
            />
          )}
        />
      </div>
      <MainButton
        className="w-full mt-10"
        size="super"
        type="submit"
        loading={isPending}
      >
        Log In
      </MainButton>
      <div className="mt-6 flex gap-1">
        Don't have an account?
        <Link
          className="font-semibold text-primary"
          to={`../${EROUTES.SIGN_UP}`}
        >
          Sign Up
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
