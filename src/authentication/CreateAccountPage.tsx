import { useState } from "react";
import { registerMock } from "./backendmock";
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

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit() {
    setState("in-progress");
    const isSuccess = await registerMock(fullName, email, password);
    setState(isSuccess ? "success" : "error");
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
            Or{" "}
            <a
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              sign in to an existing account
            </a>
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
                icon={state === "in-progress" ? <Spinner /> : undefined}
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
