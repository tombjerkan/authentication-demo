import clsx from "clsx";
import { useState } from "react";
import styles from "./App.module.css";
import { login } from "./backendmock";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);

  async function submit() {
    setIsError(false);
    setIsSubmitting(true);

    const result = await login(email, password);

    if (result.isSuccess) {
      // TODO: Connect to an AuthProvider or similar
    } else {
      setIsSubmitting(false);
      setIsError(true);
    }
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
            Sign in to continue
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <a
              href="#"
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
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={isSubmitting}
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isSubmitting}
                  autoComplete="current-password"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
            {isError && (
              <div className="mt-2 text-sm text-red-600">
                Incorrect email and password combination.
              </div>
            )}
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={clsx(
                "group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                isSubmitting && "opacity-50"
              )}
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
              {isSubmitting ? "Signing in" : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
