import clsx from "clsx";
import { useState } from "react";
import styles from "./App.module.css";
import { sendForgotPasswordEmailMock } from "./backendmock";
import { Input, Label, Spinner } from "./components";

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
    <div
      className={`flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${styles.backgroundPattern}`}
    >
      <div className="w-full max-w-md space-y-8 overflow-hidden bg-white px-4 py-5 pt-10 shadow sm:rounded-lg sm:px-6">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
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
            <button
              type="submit"
              disabled={state === "in-progress" || state === "success"}
              className={clsx(
                "group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                (state === "in-progress" || state === "success") && "opacity-50"
              )}
            >
              {state === "in-progress" && (
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Spinner className="-ml-1 mr-3 " />
                </span>
              )}

              {state === "success"
                ? "Password reset email sent"
                : "Send password reset email"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
