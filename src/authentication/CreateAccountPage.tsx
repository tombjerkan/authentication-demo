import { useEffect, useState } from "react";
import { confirmAccount, signup } from "./identity";
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
import { useLocation } from "react-router-dom";

type State = "initial" | "in-progress" | "success" | "error";

export default function RegisterPage() {
  const confirmationToken = useConfirmationToken();

  return confirmationToken ? (
    <ConfirmAccountPage confirmationToken={confirmationToken} />
  ) : (
    <CreateAccountPage />
  );
}

function CreateAccountPage() {
  const [state, setState] = useState<State>("initial");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit() {
    setState("in-progress");

    await signup(fullName, email, password)
      .then(() => setState("success"))
      .catch(() => setState("error"));
  }

  return (
    <PageContainer>
      <Card className="w-full max-w-lg space-y-8">
        <div>
          <CompanyLogo className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or <Link to="/login">sign in to an existing account</Link>
          </p>
        </div>

        {state === "success" && <p>Success</p>}

        {state !== "success" && (
          <form
            className="mt-8 space-y-6"
            onSubmit={(event) => {
              event.preventDefault();
              submit();
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
                disabled={state === "in-progress"}
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
                disabled={state === "in-progress"}
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
                disabled={state === "in-progress"}
                required
                className="mt-1"
              />

              {state === "error" && (
                <div className="mt-2 text-sm text-red-600">
                  Could not create an account.
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
                {state === "in-progress"
                  ? "Creating account"
                  : "Create account"}
              </Button>
            </div>
          </form>
        )}
      </Card>
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

  return (
    <PageContainer>
      <Card className="max-h-md w-full max-w-lg space-y-8 py-8">
        {state === "in-progress" && (
          <div className="flex justify-center text-indigo-600">
            <Spinner />
          </div>
        )}

        {state !== "in-progress" && (
          <div>
            <CompanyLogo className="mx-auto h-12 w-auto" />

            {state === "success" && (
              <>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                  Account confirmed
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  You can now <Link to="/login">sign in to your account.</Link>
                </p>
              </>
            )}

            {state === "error" && (
              <>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                  Something went wrong
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  Please try again or contact support if the problem continues.
                </p>
              </>
            )}
          </div>
        )}
      </Card>
    </PageContainer>
  );
}

function useConfirmationToken() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.hash.substring(1));
  return searchParams.get("confirmation_token");
}
