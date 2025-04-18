import clsx from "clsx";
import { ReactNode } from "react";

const BodyText = (props: { children: ReactNode; className?: string }) => (
  <p className={clsx("text-gray-600", props.className)}>{props.children}</p>
);

export default BodyText;
