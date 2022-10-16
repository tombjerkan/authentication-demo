import {
  Button,
  Card,
  CompanyLogo,
  Input,
  Label,
  PageContainer,
  Spinner,
} from "../common/components";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { recoverPassword } from "./identity";
import assert from "../common/assert";

export default function ChangePasswordPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.hash.substring(1));
  const recoveryToken = searchParams.get("recovery_token");

  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [state, setState] = useState<
    "initial" | "in-progress" | "success" | "error"
  >("initial");

  function submit() {
    // TODO: this should be handled gracefully rather than by throwing an error
    assert(
      recoveryToken !== null,
      "recovery token should always be present when shown the recover password page"
    );

    if (password !== repeatPassword) {
      setState("error");
      return;
    }

    setState("in-progress");

    recoverPassword(recoveryToken, password)
      .then(() => setState("success"))
      .catch(() => setState("error"));
  }

  return (
    <PageContainer>
      <Card className="w-full max-w-md space-y-8">
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
            <Label htmlFor="email-address">New password</Label>
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

            <Label htmlFor="email-address" className="mt-4">
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
              {(state === "initial" || state === "error") && "Change password"}
              {state === "in-progress" && "Changing password"}
              {state === "success" && "Password changed"}
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
}
