import { useState } from "react";
import { sendForgotPasswordEmailMock } from "./backendmock";
import {
  Button,
  Card,
  CompanyLogo,
  Input,
  Label,
  PageContainer,
  Spinner,
} from "../common/components";

type State = "initial" | "in-progress" | "success" | "error";

export default function CreateAccountPage() {
  const [state, setState] = useState<State>("initial");
  const [email, setEmail] = useState("");

  async function submit() {
    setState("in-progress");
    const isSuccess = await sendForgotPasswordEmailMock(email);
    setState(isSuccess ? "success" : "error");
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
            Or{" "}
            <a
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              go back to sign-in page
            </a>
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
              icon={state === "in-progress" ? <Spinner /> : undefined}
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
