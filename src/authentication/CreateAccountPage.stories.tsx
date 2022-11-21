import { faker } from "@faker-js/faker";
import { MemoryRouter } from "react-router-dom";
import {
  CreateAccountFormView,
  ConfirmationEmailSentView,
  ConfirmAccountView,
} from "./CreateAccountPage";

export default { title: "authentication/CreateAccountPage" };

export const CreateAccountFormViewDefault = () => (
  <MemoryRouter>
    <CreateAccountFormView
      isError={false}
      isSubmitting={false}
      onSubmit={() => Promise.resolve()}
    />
  </MemoryRouter>
);

export const CreateAccountFormViewError = () => (
  <MemoryRouter>
    <CreateAccountFormView
      isError={true}
      isSubmitting={false}
      onSubmit={() => Promise.resolve()}
    />
  </MemoryRouter>
);

export const CreateAccountFormViewSubmitting = () => (
  <MemoryRouter>
    <CreateAccountFormView
      isError={false}
      isSubmitting={true}
      onSubmit={() => Promise.resolve()}
    />
  </MemoryRouter>
);

export const CreateAccountFormViewErrorAndSubmitting = () => (
  <MemoryRouter>
    <CreateAccountFormView
      isError={true}
      isSubmitting={true}
      onSubmit={() => Promise.resolve()}
    />
  </MemoryRouter>
);

export const ConfirmationEmailSent = () => (
  <ConfirmationEmailSentView email={faker.internet.email()} />
);

export const ConfirmAccountInProgress = () => (
  <MemoryRouter>
    <ConfirmAccountView state="in-progress" />
  </MemoryRouter>
);

export const ConfirmAccountSuccess = () => (
  <MemoryRouter>
    <ConfirmAccountView state="success" />
  </MemoryRouter>
);

export const ConfirmAccountError = () => (
  <MemoryRouter>
    <ConfirmAccountView state="error" />
  </MemoryRouter>
);
