import type { FC } from "react";
import AuthContainer from "./components/AuthContainer";
import SignupForm from "./components/forms/SignupForm";

const SignupPage: FC = () => {
  return (
    <AuthContainer title="Create a new account">
      <SignupForm />
    </AuthContainer>
  );
};

export default SignupPage;
