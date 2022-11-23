import clsx from "clsx";
import { PropsWithoutRef, ReactNode } from "react";

type Props = PropsWithoutRef<JSX.IntrinsicElements["button"]> & {
  icon?: ReactNode;
};

const Button = (props: Props) => (
  <button
    {...props}
    className={clsx(
      "group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
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

export default Button;
