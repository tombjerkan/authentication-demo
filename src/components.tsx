import clsx from "clsx";
import { PropsWithoutRef } from "react";

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
    className={clsx("h-5 w-5 animate-spin text-white", props.className)}
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
