import { useEffect } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useRoutes,
} from "react-router-dom";
import ConfirmAccountPage from "./authentication/ConfirmAccountPage";
import CreateAccountPage from "./authentication/CreateAccountPage";
import ForgotPasswordPage from "./authentication/ForgotPasswordPage";
import RecoverPasswordPage from "./authentication/RecoverPasswordPage";
import SignInPage from "./authentication/SignInPage";
import UserPage from "./user-profile/UserPage";

export default function Routes() {
  let pageElement = useRoutes([
    {
      path: "/login",
      element: <SignInPage />,
    },
    {
      path: "/register",
      element: <CreateAccountPage />,
    },
    {
      path: "/confirmaccount",
      element: <ConfirmAccountPage />,
    },
    {
      path: "/forgotpassword",
      element: <ForgotPasswordPage />,
    },
    {
      path: "recoverpassword",
      element: <RecoverPasswordPage />,
    },
    {
      path: "/",
      element: <Navigate to="/user" replace />,
    },
    {
      path: "/user",
      element: <UserPage />,
    },
    {
      path: "*",
      element: <h1>Page not found</h1>,
    },
  ]);

  useRedirectToConfirmAccount();
  useRedirectToRecoverPassword();

  return pageElement;
}

const useRedirectToConfirmAccount = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isIndexPage = location.pathname === "/";
    const searchParams = new URLSearchParams(location.hash.substring(1));
    const confirmationToken = searchParams.get("confirmation_token");

    if (isIndexPage && confirmationToken) {
      navigate(`/confirmaccount#confirmation_token=${confirmationToken}`, {
        replace: true,
      });
    }
  }, [location, navigate]);
};

const useRedirectToRecoverPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isIndexPage = location.pathname === "/";
    const searchParams = new URLSearchParams(location.hash.substring(1));
    const recoveryToken = searchParams.get("recovery_token");

    if (isIndexPage && recoveryToken) {
      navigate(`/recoverpassword#recovery_token=${recoveryToken}`, {
        state: { token: recoveryToken },
        replace: true,
      });
    }
  }, [location, navigate]);
};
