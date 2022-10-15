import GoTrue from "gotrue-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

const client = new GoTrue({
  APIUrl: "https://bjerkandemo.netlify.app/.netlify/identity",
});

export const getCurrentUser = () => client.currentUser();

export const signup = (fullName: string, email: string, password: string) =>
  client.signup(email, password, { fullName });

export const confirmAccount = (token: string) => client.confirm(token);

export const requestPasswordRecovery = (email: string) =>
  client.requestPasswordRecovery(email);

interface User {
  email: string;
  fullName: string;
}

interface AuthContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider(props: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useUser() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useUser must be used within an AuthProvider");
  }

  return context.user;
}

export function useLogin(): [
  (email: string, password: string) => void,
  boolean,
  boolean
] {
  const context = useContext(AuthContext);
  const [isInProgress, setIsInProgress] = useState(false);
  const [isError, setIsError] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (context === undefined) {
    throw new Error("useLogin must be used within an AuthProvider");
  }

  async function login(email: string, password: string) {
    const redirect = location.state?.from?.pathname ?? "/";

    setIsInProgress(true);

    await client
      .login(email, password)
      .then((response) => {
        assert(context !== undefined);
        context.setUser({ fullName: response.user_metadata.fullName, email });
        navigate(redirect, { replace: true });
      })
      .catch((error) => {
        setIsInProgress(false);
        setIsError(true);
      });
  }

  return [login, isInProgress, isError];
}

export function useLogout() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useLogout must be used within an AuthProvider");
  }

  function logout() {
    assert(context !== undefined);

    const currentUser = client.currentUser();

    if (currentUser === null) {
      console.warn("A logout was attempted without a user being logged in");
      return;
    }

    currentUser
      .logout()
      .then(() => {
        context.setUser(null);
      })
      .catch(console.error);
  }

  return logout;
}

export function useRequireAuth() {
  const context = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  if (context === undefined) {
    throw new Error("useRequireAuth must be used within an AuthProvider");
  }

  const { user } = context;

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: location }, replace: true });
    }
  }, [location, navigate, user]);
}

function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new AssertionError(msg);
  }
}

class AssertionError extends Error {}
