import clsx from "clsx";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

const SubHeader = (props: Props) => (
  <p className={clsx("text-center text-sm text-gray-600", props.className)}>
    {props.children}
  </p>
);

export default SubHeader;
