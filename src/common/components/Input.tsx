import clsx from "clsx";
import { PropsWithoutRef } from "react";

type Props = PropsWithoutRef<JSX.IntrinsicElements["input"]>;

const Input = (props: Props) => (
  <input
    {...props}
    className={clsx(
      "relative block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500",
      props.disabled && "opacity-50",
      props.className
    )}
  />
);

export default Input;
