import clsx from "clsx";
import { Link as ReactRouterLink, LinkProps } from "react-router-dom";

type Props = LinkProps & React.RefAttributes<HTMLAnchorElement>;

const Link = (props: Props) => (
  <ReactRouterLink
    {...props}
    className={clsx(
      "font-medium text-indigo-600 hover:text-indigo-500",
      props.className
    )}
  />
);

export default Link;
