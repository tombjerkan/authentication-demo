import clsx from "clsx";
import { PropsWithoutRef, ReactNode } from "react";
import styles from "./components.module.css";
import { Link as ReactRouterLink, LinkProps } from "react-router-dom";

export const PageContainer = (props: { children: ReactNode }) => (
  <div
    className={clsx(
      "flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8",
      styles.backgroundPattern
    )}
  >
    {props.children}
  </div>
);

export const Card = (props: { className?: string; children: ReactNode }) => (
  <div
    className={clsx(
      "overflow-hidden bg-white shadow sm:rounded-lg",
      props.className
    )}
  >
    <div className="px-4 py-5 sm:p-6">{props.children}</div>
  </div>
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

export const CompanyLogo = (props: { className?: string }) => (
  <img
    className={props.className}
    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
    alt="Your Company"
  />
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
