import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  changePassword,
  requestPasswordRecovery,
  useRecover,
} from "../authentication/identity";
import {
  BodyText,
  Button,
  Input,
  Label,
  Link,
  MainHeader,
  PageContainer,
  Spinner,
  SubHeader,
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

  if (state === "success") {
    return <ResetEmailSentPage email={email} />;
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <div>
          <MainHeader>Forgot your password?</MainHeader>
          <SubHeader className="mt-2">
            Or <Link to="/login">go back to sign-in page</Link>
          </SubHeader>
        </div>

        <BodyText>
          Enter the email address for your account, and we'll email you a link
          to reset your password.
        </BodyText>

        <form
          className="mt-8"
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
              disabled={state === "in-progress"}
              required
              className="mt-1"
            />
          </div>
          {state === "error" && (
            <BodyText className="mt-2 text-red-600">
              No account exists for the given email address.
            </BodyText>
          )}
          <Button
            type="submit"
            disabled={state === "in-progress"}
            icon={
              state === "in-progress" ? (
                <Spinner className="text-white" />
              ) : undefined
            }
            className="mt-6"
          >
            {state === "in-progress"
              ? "Sending reset email"
              : "Send reset email"}
          </Button>
        </form>
      </div>
    </PageContainer>
  );
}

function ResetEmailSentPage(props: { email: string }) {
  return (
    <PageContainer>
      <div className="space-y-8">
        <div>
          <MainHeader>Forgot your password?</MainHeader>
          <SubHeader className="mt-2">
            Or <Link to="/login">go back to sign-in page</Link>
          </SubHeader>
        </div>

        <BodyText className="mt-2">
          A link to reset your password has been sent to {props.email}.
        </BodyText>
      </div>
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
      {isRecoveryInProgress && (
        <div className="flex justify-center text-indigo-600">
          <Spinner />
        </div>
      )}

      {isRecoveryError && (
        <>
          <MainHeader>Something went wrong</MainHeader>
          <SubHeader className="mt-10">
            Please try again or contact support if the problem continues.
          </SubHeader>
        </>
      )}

      {!isRecoveryInProgress && state !== "success" && (
        <>
          <MainHeader>Choose a new password</MainHeader>
          <form
            className="mt-16 space-y-6"
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
                disabled={state === "in-progress"}
                icon={
                  state === "in-progress" ? (
                    <Spinner className="text-white" />
                  ) : undefined
                }
              >
                {(state === "initial" || state === "error") &&
                  "Change password"}
                {state === "in-progress" && "Changing password"}
              </Button>
            </div>
          </form>
        </>
      )}

      {state === "success" && (
        <>
          <MainHeader>Password changed</MainHeader>
          <SubHeader className="mt-10">
            You can now <Link to="/">continue to the application</Link>.
          </SubHeader>
        </>
      )}
    </PageContainer>
  );
}

function useRecoveryTokenHashParam() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.hash.substring(1));
  return searchParams.get("recovery_token");
}
