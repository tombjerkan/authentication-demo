import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginMock } from "./backendmock";

interface User {
  email: string;
  fullName: string;
}

interface AuthContextValue {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider(props: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User) => setUser(user);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
    const result = await loginMock(email, password);

    if (result.isSuccess) {
      assert(context !== undefined);
      context.login(result);
      navigate(redirect, { replace: true });
    } else {
      setIsInProgress(false);
      setIsError(true);
    }
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
    context.logout();
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
