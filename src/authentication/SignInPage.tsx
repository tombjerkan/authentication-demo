import { useState } from "react";
import { useLogin } from "./identity";
import {
  Button,
  Input,
  Label,
  Link,
  MainHeader,
  PageContainer,
  Spinner,
  SubHeader,
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
        <MainHeader>Sign in</MainHeader>
        <SubHeader className="mt-2">
          Or <Link to="/register">create an account</Link>
        </SubHeader>
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
