import clsx from "clsx";
import { PropsWithoutRef, ReactNode } from "react";
import styles from "./components.module.css";
import { Link as ReactRouterLink, LinkProps } from "react-router-dom";

export const PageContainer = (props: { children: ReactNode }) => (
  <div
    className={clsx(
      "flex min-h-full items-center justify-center",
      styles.backgroundPattern
    )}
  >
    <div className="mx-auto my-12 w-full overflow-hidden bg-white px-4 pt-12 pb-5 shadow sm:mx-4 sm:max-w-lg sm:rounded-lg">
      {props.children}
    </div>
  </div>
);

export const MainHeader = (props: { children: ReactNode }) => (
  <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
    {props.children}
  </h2>
);

export const SubHeader = (props: {
  children: ReactNode;
  className?: string;
}) => (
  <p className={clsx("text-center text-sm text-gray-600", props.className)}>
    {props.children}
  </p>
);

export const BodyText = (props: {
  children: ReactNode;
  className?: string;
}) => (
  <p className={clsx("text-sm text-gray-500", props.className)}>
    {props.children}
  </p>
);

export const Label = (
  props: PropsWithoutRef<JSX.IntrinsicElements["label"]>
) => (
  <label
    {...props}
    className={clsx("block text-sm font-medium text-gray-700", props.className)}
  />
);

export const Input = (
  props: PropsWithoutRef<JSX.IntrinsicElements["input"]>
) => (
  <input
    {...props}
    className={clsx(
      "relative block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
      props.disabled && "opacity-50",
      props.className
    )}
  />
);

export const Spinner = (
  props: PropsWithoutRef<JSX.IntrinsicElements["svg"]>
) => (
  <svg
    className={clsx("h-5 w-5 animate-spin", props.className)}
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

export const Button = (
  props: PropsWithoutRef<JSX.IntrinsicElements["button"]> & { icon?: ReactNode }
) => (
  <button
    {...props}
    className={clsx(
      "group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
      props.disabled && "opacity-50",
      props.className
    )}
  >
    {props.icon && (
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        {props.icon}
      </span>
    )}
    <span className="-ml-1 mr-3">{props.children}</span>
  </button>
);

export const Link = (
  props: LinkProps & React.RefAttributes<HTMLAnchorElement>
) => (
  <ReactRouterLink
    {...props}
    className={clsx(
      "font-medium text-indigo-600 hover:text-indigo-500",
      props.className
    )}
  />
);
