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

export default function ForgotPasswordPage() {
  const recoveryToken = useRecoveryTokenHashParam();

  return recoveryToken ? (
    <ChangePasswordPage recoveryToken={recoveryToken} />
  ) : (
    <RequestPasswordRecoveryPage />
  );
}

function RequestPasswordRecoveryPage() {
  const [state, setState] = useState<
    | { state: "initial" | "error" | "in-progress" }
    | { state: "success"; email: string }
  >({ state: "initial" });

  async function submit(email: string) {
    setState({ state: "in-progress" });

    requestPasswordRecovery(email)
      .then(() => setState({ state: "success", email }))
      .catch(() => setState({ state: "error" }));
  }

  if (state.state !== "success") {
    return (
      <RequestPasswordRecoveryFormView state={state.state} onSubmit={submit} />
    );
  } else {
    return <ResetEmailSentView email={state.email} />;
  }
}

export function RequestPasswordRecoveryFormView(props: {
  state: "initial" | "in-progress" | "error";
  onSubmit: (email: string) => Promise<void>;
}) {
  const [email, setEmail] = useState("");

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
            props.onSubmit(email);
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
              disabled={props.state === "in-progress"}
              required
              className="mt-1"
            />
          </div>
          {props.state === "error" && (
            <BodyText className="mt-2 text-red-600">
              <span className="text-red-600">
                No account exists for the given email address.
              </span>
            </BodyText>
          )}
          <Button
            type="submit"
            disabled={props.state === "in-progress"}
            icon={
              props.state === "in-progress" ? (
                <Spinner className="text-white" />
              ) : undefined
            }
            className="mt-6"
          >
            {props.state === "in-progress"
              ? "Sending reset email"
              : "Send reset email"}
          </Button>
        </form>
      </div>
    </PageContainer>
  );
}

export function ResetEmailSentView(props: { email: string }) {
  return (
    <PageContainer>
      <div className="space-y-8 pb-7">
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

  const [state, setState] = useState<
    "initial" | "in-progress" | "success" | "error"
  >("initial");

  function submit(password: string, repeatPassword: string) {
    if (password !== repeatPassword) {
      setState("error");
      return;
    }

    setState("in-progress");

    changePassword(password)
      .then(() => setState("success"))
      .catch(() => setState("error"));
  }

  if (isRecoveryInProgress) {
    return <RecoveryInProgressView />;
  } else if (isRecoveryError) {
    return <RecoveryErrorView />;
  } else if (state !== "success") {
    return <ChangePasswordFormView state={state} onSubmit={submit} />;
  } else {
    return <ChangePasswordSuccessView />;
  }
}

export function RecoveryInProgressView() {
  return (
    <PageContainer>
      <div className="mb-7 flex justify-center text-indigo-600">
        <Spinner />
      </div>
    </PageContainer>
  );
}

export function RecoveryErrorView() {
  return (
    <PageContainer>
      <MainHeader>Something went wrong</MainHeader>
      <SubHeader className="mt-2 mb-7">
        Please try again or contact support if the problem continues.
      </SubHeader>
    </PageContainer>
  );
}

export function ChangePasswordFormView(props: {
  state: "initial" | "in-progress" | "error";
  onSubmit: (password: string, repeatPassword: string) => void;
}) {
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  return (
    <PageContainer>
      <MainHeader>Choose a new password</MainHeader>
      <form
        className="mt-8 space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          props.onSubmit(password, repeatPassword);
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
            disabled={props.state === "in-progress"}
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
            disabled={props.state === "in-progress"}
            required
            className="mt-1"
          />

          {props.state === "error" && (
            <div className="mt-2 text-sm text-red-600">
              Something went wrong.
            </div>
          )}
        </div>

        <div>
          <Button
            type="submit"
            disabled={props.state === "in-progress"}
            icon={
              props.state === "in-progress" ? (
                <Spinner className="text-white" />
              ) : undefined
            }
          >
            {(props.state === "initial" || props.state === "error") &&
              "Change password"}
            {props.state === "in-progress" && "Changing password"}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}

export function ChangePasswordSuccessView() {
  return (
    <PageContainer>
      <MainHeader>Password changed</MainHeader>
      <SubHeader className="mt-2 mb-7">
        You can now <Link to="/">continue to the application</Link>.
      </SubHeader>
    </PageContainer>
  );
}

function useRecoveryTokenHashParam() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.hash.substring(1));
  return searchParams.get("recovery_token");
}
