import { MemoryRouter } from "react-router-dom";
import { PageView } from "./SignInPage";

export default {
  title: "authentication/SignInPage",
  component: PageView,
};

export const Default = () => (
  <MemoryRouter>
    <PageView
      onSubmit={() => {}}
      isLoginInProgress={false}
      isLoginError={false}
    />
  </MemoryRouter>
);

export const InProgress = () => (
  <MemoryRouter>
    <PageView
      onSubmit={() => {}}
      isLoginInProgress={true}
      isLoginError={false}
    />
  </MemoryRouter>
);

export const Error = () => (
  <MemoryRouter>
    <PageView
      onSubmit={() => {}}
      isLoginInProgress={false}
      isLoginError={true}
    />
  </MemoryRouter>
);

export const ErrorAndInProgress = () => (
  <MemoryRouter>
    <PageView
      onSubmit={() => {}}
      isLoginInProgress={true}
      isLoginError={true}
    />
  </MemoryRouter>
);
