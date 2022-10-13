import clsx from "clsx";
import { HTMLAttributes, HTMLProps, PropsWithoutRef, useState } from "react";
import styles from "./App.module.css";
import { registerMock } from "./backendmock";

type State = "initial" | "in-progress" | "success" | "error";

export default function CreateAccountPage() {
  const [state, setState] = useState("initial");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit() {
    setState("in-progress");
    const isSuccess = await registerMock(fullName, email, password);
    setState(isSuccess ? "success" : "error");
  }

  return (
    <div
      className={`flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${styles.backgroundPattern}`}
    >
      <div className="w-full max-w-lg space-y-8 overflow-hidden bg-white px-4 py-5 pt-10 shadow sm:rounded-lg sm:px-6">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
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
              <button
                type="submit"
                disabled={state === "in-progress"}
                className={clsx(
                  "group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                  state === "in-progress" && "opacity-50"
                )}
              >
                {state === "in-progress" && (
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <LoadingSpinner />
                  </span>
                )}
                {state === "in-progress"
                  ? "Creating account"
                  : "Create account"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const Label = (props: PropsWithoutRef<JSX.IntrinsicElements["label"]>) => (
  <label
    {...props}
    className={clsx("block text-sm font-medium text-gray-700", props.className)}
  />
);

const Input = (props: PropsWithoutRef<JSX.IntrinsicElements["input"]>) => (
  <input
    {...props}
    className={clsx(
      "relative block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
      props.disabled && "opacity-50",
      props.className
    )}
  />
);

const LoadingSpinner = () => (
  <svg
    className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);
