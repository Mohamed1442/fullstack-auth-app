import type { FC } from "react";
import LoginForm from "./components/forms/LoginForm";
import AuthContainer from "./components/AuthContainer";

const LoginPage: FC = () => {
  return (
    <AuthContainer title="Login to your account">
      <LoginForm />
    </AuthContainer>
  );
};

export default LoginPage;
