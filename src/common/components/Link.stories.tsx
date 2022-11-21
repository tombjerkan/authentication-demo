import { MemoryRouter } from "react-router-dom";
import Link from "./Link";

export default {
  title: "common/Link",
  component: Link,
};

export const Default = () => (
  <MemoryRouter>
    <Link to=".">Click to go somewhere</Link>
  </MemoryRouter>
);
