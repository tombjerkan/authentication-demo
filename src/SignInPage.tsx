import clsx from "clsx";
import { useState } from "react";
import styles from "./App.module.css";
import { useLogin } from "./AuthProvider";
import { Input, Label, Spinner } from "./components";

export default function SignInPage() {
  const [login, isLoginInProgress, isLoginError] = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit() {
    login(email, password);
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
            Sign in
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <a
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create an account
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
          <div>
            <Label htmlFor="email-address">Email address</Label>
            <Input
              id="email-address"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isLoginInProgress}
              autoComplete="email"
              required
              className="mt-1"
            />

            <Label htmlFor="password" className="mt-4">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isLoginInProgress}
              autoComplete="current-password"
              required
              className="mt-1"
            />

            {isLoginError && (
              <div className="mt-2 text-sm text-red-600">
                Incorrect email and password combination.
              </div>
            )}
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <a
                href="/forgotpassword"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoginInProgress}
              className={clsx(
                "group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                isLoginInProgress && "opacity-50"
              )}
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                {isLoginInProgress ? (
                  <Spinner className="-ml-1 mr-3 " />
                ) : (
                  <LockIcon />
                )}
              </span>
              {isLoginInProgress ? "Signing in" : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const LockIcon = () => (
  <svg
    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
      clipRule="evenodd"
    />
  </svg>
);
