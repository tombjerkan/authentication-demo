import { useState } from "react";
import { useLogin } from "./identity";
import {
  Button,
  Input,
  Label,
  Link,
  PageContainer,
  Spinner,
} from "../common/components";

export default function SignInPage() {
  const [login, isLoginInProgress, isLoginError] = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit() {
    login(email, password);
  }

  return (
    <PageContainer>
      <div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or <Link to="/register">create an account</Link>
        </p>
      </div>
      <form
        className="mt-8 space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <div>
          <Label htmlFor="email-address">Email address</Label>
          <Input
            id="email-address"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isLoginInProgress}
            autoComplete="email"
            required
            className="mt-1"
          />

          <Label htmlFor="password" className="mt-4">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isLoginInProgress}
            autoComplete="current-password"
            required
            className="mt-1"
          />

          {isLoginError && (
            <div className="mt-2 text-sm text-red-600">
              Incorrect email and password combination.
            </div>
          )}
        </div>

        <div className="flex items-center justify-end">
          <div className="text-sm">
            <Link to="/forgotpassword">Forgot your password?</Link>
          </div>
        </div>

        <div>
          <Button
            type="submit"
            disabled={isLoginInProgress}
            icon={
              isLoginInProgress ? <Spinner className="text-white" /> : undefined
            }
          >
            {isLoginInProgress ? "Signing in" : "Sign in"}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
