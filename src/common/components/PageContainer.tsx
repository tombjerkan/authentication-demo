import clsx from "clsx";
import { ReactNode } from "react";
import styles from "./PageContainer.module.css";

interface Props {
  children: ReactNode;
}

const PageContainer = (props: Props) => (
  <div
    className={clsx(
      "flex min-h-full items-center justify-center",
      styles.backgroundPattern
    )}
  >
    <div className="mx-auto my-12 w-full overflow-hidden bg-white px-4 pt-12 pb-5 shadow sm:mx-4 sm:max-w-lg sm:rounded-lg">
      {props.children}
    </div>
  </div>
);

export default PageContainer;
