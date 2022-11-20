import clsx from "clsx";
import { PropsWithoutRef } from "react";

type Props = PropsWithoutRef<JSX.IntrinsicElements["label"]>;

const Label = (props: Props) => (
  <label
    {...props}
    className={clsx("block text-sm font-medium text-gray-700", props.className)}
  />
);

export default Label;
