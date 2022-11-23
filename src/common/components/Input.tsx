import clsx from "clsx";
import { PropsWithoutRef } from "react";

type Props = PropsWithoutRef<JSX.IntrinsicElements["input"]>;

const Input = (props: Props) => (
  <input
    {...props}
    // Add default type so that styles using [type='text'] are applied even if prop not explicitly set
    type={props.type ?? "text"}
    className={clsx(
      "relative block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500",
      props.disabled && "opacity-50",
      props.className
    )}
  />
);

export default Input;
