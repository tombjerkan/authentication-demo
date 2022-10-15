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

  return pageElement;
}

const useRedirectToConfirmAccount = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.hash.substring(1));
    const confirmationToken = searchParams.get("confirmation_token");

    if (confirmationToken) {
      navigate("/confirmaccount", {
        state: { token: confirmationToken },
        replace: true,
      });
    }
  }, [location, navigate]);
};
