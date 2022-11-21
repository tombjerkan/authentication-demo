import { useEffect, useState } from "react";
import { confirmAccount, signup } from "./identity";
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
import { useLocation } from "react-router-dom";

export default function RegisterPage() {
  const confirmationToken = useConfirmationToken();

  return confirmationToken ? (
    <ConfirmAccountPage confirmationToken={confirmationToken} />
  ) : (
    <CreateAccountPage />
  );
}

function CreateAccountPage() {
  const [state, setState] = useState<
    | { page: "create-account"; isError: boolean; isSubmitting: boolean }
    | { page: "email-sent"; email: string }
  >({ page: "create-account", isError: false, isSubmitting: false });

  async function handleSubmit(data: {
    fullName: string;
    email: string;
    password: string;
  }) {
    setState({ page: "create-account", isError: false, isSubmitting: true });

    await signup(data.fullName, data.email, data.password)
      .then(() => setState({ page: "email-sent", email: data.email }))
      .catch(() =>
        setState({ page: "create-account", isError: true, isSubmitting: false })
      );
  }

  switch (state.page) {
    case "create-account":
      return (
        <CreateAccountFormView
          isError={state.isError}
          isSubmitting={state.isSubmitting}
          onSubmit={handleSubmit}
        />
      );
    case "email-sent":
      return <ConfirmationEmailSentView email={state.email} />;
  }
}

export function CreateAccountFormView(props: {
  isError: boolean;
  isSubmitting: boolean;
  onSubmit: (data: {
    fullName: string;
    email: string;
    password: string;
  }) => Promise<void>;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <PageContainer>
      <div className="space-y-8">
        <div>
          <MainHeader>Create an account</MainHeader>
          <SubHeader className="mt-2">
            Or <Link to="/login">sign in to an existing account</Link>
          </SubHeader>
        </div>

        <form
          className="mt-8 space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            props.onSubmit({ fullName, email, password });
          }}
        >
          <div className="rounded-md shadow-sm">
            <Label htmlFor="full-name">Full name</Label>
            <Input
              id="full-name"
              name="fullName"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              type="text"
              disabled={props.isSubmitting}
              required
              className="mt-1"
            />

            <Label htmlFor="email-address" className="mt-4">
              Email address
            </Label>
            <Input
              id="email-address"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              disabled={props.isSubmitting}
              required
              className="mt-1"
            />

            <Label htmlFor="password" className="mt-4">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              disabled={props.isSubmitting}
              required
              className="mt-1"
            />

            {props.isError && (
              <div className="mt-2 text-sm text-red-600">
                Could not create an account.
              </div>
            )}
          </div>

          <div>
            <Button
              type="submit"
              disabled={props.isSubmitting}
              icon={
                props.isSubmitting ? (
                  <Spinner className="text-white" />
                ) : undefined
              }
            >
              {props.isSubmitting ? "Creating account" : "Create account"}
            </Button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
}

export function ConfirmationEmailSentView(props: { email: string }) {
  return (
    <PageContainer>
      <MainHeader>Create an account</MainHeader>
      <BodyText>
        A link to confirm your new account has been sent to {props.email}.
      </BodyText>
    </PageContainer>
  );
}

function ConfirmAccountPage(props: { confirmationToken: string }) {
  const [state, setState] = useState<"in-progress" | "success" | "error">(
    "in-progress"
  );

  useEffect(() => {
    confirmAccount(props.confirmationToken)
      .then(() => setState("success"))
      .catch(() => setState("error"));
  }, [props.confirmationToken]);

  return <ConfirmAccountView state={state} />;
}

export function ConfirmAccountView(props: {
  state: "in-progress" | "success" | "error";
}) {
  return (
    <PageContainer>
      {props.state === "in-progress" && (
        <div className="flex justify-center text-indigo-600">
          <Spinner />
        </div>
      )}

      {props.state !== "in-progress" && (
        <div>
          {props.state === "success" && (
            <>
              <MainHeader>Account confirmed</MainHeader>
              <SubHeader>
                You can now <Link to="/login">sign in to your account</Link>.
              </SubHeader>
            </>
          )}

          {props.state === "error" && (
            <>
              <MainHeader>Something went wrong</MainHeader>
              <SubHeader className="mt-2">
                Please try again or contact support if the problem continues.
              </SubHeader>
            </>
          )}
        </div>
      )}
    </PageContainer>
  );
}

function useConfirmationToken() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.hash.substring(1));
  return searchParams.get("confirmation_token");
}
