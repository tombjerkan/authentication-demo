import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const MainHeader = (props: Props) => (
  <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
    {props.children}
  </h2>
);

export default MainHeader;
