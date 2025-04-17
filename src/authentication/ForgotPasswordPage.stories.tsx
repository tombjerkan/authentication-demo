import { faker } from "@faker-js/faker";
import { MemoryRouter } from "react-router-dom";
import {
  RequestPasswordRecoveryFormView,
  RecoveryErrorView,
  ChangePasswordFormView,
  ChangePasswordSuccessView,
  ResetEmailSentView,
  RecoveryInProgressView,
} from "./ForgotPasswordPage";

export default { title: "authentication/ForgotPasswordPage" };

export const RequestPasswordRecoveryFormViewDefault = () => (
  <MemoryRouter>
    <RequestPasswordRecoveryFormView
      state="initial"
      onSubmit={() => Promise.resolve()}
    />
  </MemoryRouter>
);

export const RequestPasswordRecoveryFormViewError = () => (
  <MemoryRouter>
    <RequestPasswordRecoveryFormView
      state="error"
      onSubmit={() => Promise.resolve()}
    />
  </MemoryRouter>
);

export const RequestPasswordRecoveryFormViewSubmitting = () => (
  <MemoryRouter>
    <RequestPasswordRecoveryFormView
      state="in-progress"
      onSubmit={() => Promise.resolve()}
    />
  </MemoryRouter>
);

export const ResetEmailSent = () => (
  <MemoryRouter>
    <ResetEmailSentView email={faker.internet.email()} />
  </MemoryRouter>
);

export const RecoveryInProgress = () => <RecoveryInProgressView />;

export const RecoveryError = () => <RecoveryErrorView />;

export const ChangePasswordFormDefault = () => (
  <ChangePasswordFormView state="initial" onSubmit={() => {}} />
);

export const ChangePasswordFormSubmitting = () => (
  <ChangePasswordFormView state="in-progress" onSubmit={() => {}} />
);

export const ChangePasswordFormError = () => (
  <ChangePasswordFormView state="error" onSubmit={() => {}} />
);

export const ChangePasswordSuccess = () => (
  <MemoryRouter>
    <ChangePasswordSuccessView />
  </MemoryRouter>
);
