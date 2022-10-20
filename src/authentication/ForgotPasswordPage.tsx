import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  changePassword,
  requestPasswordRecovery,
  useRecover,
} from "../authentication/identity";
import {
  Button,
  Card,
  CompanyLogo,
  Input,
  Label,
  Link,
  PageContainer,
  Spinner,
} from "../common/components";

type State = "initial" | "in-progress" | "success" | "error";

export default function ForgotPasswordPage() {
  const recoveryToken = useRecoveryTokenHashParam();

  return recoveryToken ? (
    <ChangePasswordPage recoveryToken={recoveryToken} />
  ) : (
    <RequestPasswordRecoveryPage />
  );
}

function RequestPasswordRecoveryPage() {
  const [state, setState] = useState<State>("initial");
  const [email, setEmail] = useState("");

  async function submit() {
    setState("in-progress");

    requestPasswordRecovery(email)
      .then(() => setState("success"))
      .catch(() => setState("error"));
  }

  return (
    <PageContainer>
      <Card className="w-full max-w-md space-y-8">
        <div>
          <CompanyLogo className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or <Link to="/login">go back to sign-in page</Link>
          </p>
        </div>

        <form
          className="mt-8 space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <div className="rounded-md shadow-sm">
            <Label htmlFor="email-address" className="mt-4">
              Email address
            </Label>
            <Input
              id="email-address"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              disabled={state === "in-progress" || state === "success"}
              required
              className="mt-1"
            />

            {state === "error" && (
              <div className="mt-2 text-sm text-red-600">
                There is no account with the given email address.
              </div>
            )}
          </div>

          <div>
            <Button
              type="submit"
              disabled={state === "in-progress" || state === "success"}
              icon={
                state === "in-progress" ? (
                  <Spinner className="text-white" />
                ) : undefined
              }
            >
              {state === "success"
                ? "Password reset email sent"
                : "Send password reset email"}
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
}

function ChangePasswordPage(props: { recoveryToken: string }) {
  const [isRecoveryInProgress, isRecoveryError] = useRecover(
    props.recoveryToken
  );

  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [state, setState] = useState<
    "initial" | "in-progress" | "success" | "error"
  >("initial");

  function submit() {
    if (password !== repeatPassword) {
      setState("error");
      return;
    }

    setState("in-progress");

    changePassword(password)
      .then(() => setState("success"))
      .catch(() => setState("error"));
  }

  return (
    <PageContainer>
      <Card className="w-full max-w-md space-y-8">
        {isRecoveryInProgress && (
          <div className="flex justify-center text-indigo-600">
            <Spinner />
          </div>
        )}

        {isRecoveryError && (
          <>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Something went wrong
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please try again or contact support if the problem continues.
            </p>
          </>
        )}

        {!isRecoveryInProgress && (
          <>
            <div>
              <CompanyLogo className="mx-auto h-12 w-auto" />
              <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                Choose a new password
              </h2>
            </div>
            <form
              className="mt-8 space-y-6"
              onSubmit={(event) => {
                event.preventDefault();
                submit();
              }}
            >
              <div>
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={state === "in-progress"}
                  required
                  className="mt-1"
                />

                <Label htmlFor="repeat-password" className="mt-4">
                  Repeat password
                </Label>
                <Input
                  id="repeat-password"
                  name="repeat-password"
                  type="password"
                  value={repeatPassword}
                  onChange={(event) => setRepeatPassword(event.target.value)}
                  disabled={state === "in-progress"}
                  required
                  className="mt-1"
                />

                {state === "error" && (
                  <div className="mt-2 text-sm text-red-600">
                    Something went wrong.
                  </div>
                )}
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={state === "in-progress" || state === "success"}
                  icon={
                    state === "in-progress" ? (
                      <Spinner className="text-white" />
                    ) : undefined
                  }
                >
                  {(state === "initial" || state === "error") &&
                    "Change password"}
                  {state === "in-progress" && "Changing password"}
                  {state === "success" && "Password changed"}
                </Button>
              </div>
            </form>
          </>
        )}
      </Card>
    </PageContainer>
  );
}

function useRecoveryTokenHashParam() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.hash.substring(1));
  return searchParams.get("recovery_token");
}
