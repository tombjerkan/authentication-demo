import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./authentication/AuthProvider";
import CreateAccountPage from "./authentication/CreateAccountPage";
import ForgotPasswordPage from "./authentication/ForgotPasswordPage";
import SignInPage from "./authentication/SignInPage";
import UserPage from "./user-profile/UserPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<SignInPage />} />
          <Route path="/register" element={<CreateAccountPage />} />
          <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
          <Route path="/" element={<Navigate to="/user" replace />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="*" element={<h1>Page not found</h1>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
