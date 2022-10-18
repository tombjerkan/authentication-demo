import { useEffect } from "react";
import {
  Navigate,
  Route,
  Routes as ReactRouterRoutes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import RegisterPage from "./authentication/CreateAccountPage";
import ForgotPasswordPage from "./authentication/ForgotPasswordPage";
import { AuthProvider } from "./authentication/identity";
import SignInPage from "./authentication/SignInPage";
import UserPage from "./user-profile/UserPage";

export default function App() {
  useRedirectToConfirmAccount();
  useRedirectToRecoverPassword();

  return (
    <AuthProvider>
      <ReactRouterRoutes>
        <Route path="/login" element={<SignInPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
        <Route path="/" element={<Navigate to="/user" replace />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="*" element={<h1>Page not found</h1>} />
      </ReactRouterRoutes>
    </AuthProvider>
  );
}

const useRedirectToConfirmAccount = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isIndexPage = location.pathname === "/";
    const searchParams = new URLSearchParams(location.hash.substring(1));
    const confirmationToken = searchParams.get("confirmation_token");

    if (isIndexPage && confirmationToken) {
      navigate(`/register#confirmation_token=${confirmationToken}`, {
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
      navigate(`/forgotpassword#recovery_token=${recoveryToken}`, {
        replace: true,
      });
    }
  }, [location, navigate]);
};
