import { useRegister } from "@api/auth/auth.hooks";
import type { IRegesterRequest } from "@api/auth/auth.types";
import MainButton from "@components/MainButton/MainButton";
import MainInput from "@components/MainInput/MainInput";
import { EROUTES } from "@constants/routes";
import { yupResolver } from "@hookform/resolvers/yup";
import { tokenManager } from "@utils/tokenManager";
import { AxiosError } from "axios";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

const registerSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters"),
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

const SignupForm = () => {
  const navigate = useNavigate();
  const { mutateAsync: signup, isPending } = useRegister();
  const { handleSubmit, control } = useForm<IRegesterRequest>({
    resolver: yupResolver(registerSchema),
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<IRegesterRequest> = async (
    data: IRegesterRequest
  ) => {
    try {
      const { accessToken, refreshToken } = await signup(data);
      navigate(EROUTES.ROOT);

      tokenManager.setAccessToken(accessToken);
      tokenManager.setRefreshToken(refreshToken);

      toast.success("Welcome!");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message);
      }
    }
  };

  return (
    <form className="w-[363px] mt-20" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex w-full flex-col gap-5">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }): React.ReactElement => (
            <MainInput
              label="Name"
              type="string"
              error={fieldState?.error?.message}
              {...field}
            />
          )}
        />
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
        Sign Up
      </MainButton>
      <div className="mt-6 flex gap-1">
        Already have account ?
        <Link className="font-semibold text-primary" to={`../${EROUTES.LOGIN}`}>
          Login
        </Link>
      </div>
    </form>
  );
};

export default SignupForm;
