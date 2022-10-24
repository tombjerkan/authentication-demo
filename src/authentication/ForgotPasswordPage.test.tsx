import App from "../App";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { createUser, identityService } from "../msw-handlers";

const renderWithRouter = (
  ui: Parameters<typeof render>[0],
  initialUrl: string,
  options?: Parameters<typeof render>[1]
) =>
  render(
    <MemoryRouter initialEntries={[initialUrl]}>
      <LocationValue />
      {ui}
    </MemoryRouter>,
    options
  );

function LocationValue() {
  const location = useLocation();
  return <div data-testid="location-value" data-pathname={location.pathname} />;
}

async function expectPathnameToBe(expected: string) {
  const locationValueDiv = screen.getByTestId("location-value");
  expect(locationValueDiv).toHaveAttribute("data-pathname", expected);
}

test("can recover account and reset password", async () => {
  createUser("test@email.com", "", "");
  renderWithRouter(<App />, "/forgotpassword");

  userEvent.type(screen.getByLabelText("Email address"), "test@email.com");
  userEvent.click(screen.getByText("Send password reset email"));

  await screen.findByText("Password reset email sent");

  // When the user follows the link in the recovery email they received, it
  // will be a fresh render of the whole app. To recreate this, we need to
  // completely unmount the app and start anew.
  cleanup();

  const token = identityService.getRecoveryTokenForUser("test@email.com");

  renderWithRouter(<App />, "/#recovery_token=" + token);

  await expectPathnameToBe("/forgotpassword");
  await screen.findByText("Choose a new password");
  userEvent.type(screen.getByLabelText("New password"), "mynewpassword");

  // Shows error if passwords aren't the same
  userEvent.type(screen.getByLabelText("Repeat password"), "anotherpassword");
  userEvent.click(screen.getByText("Change password"));
  screen.getByText("Something went wrong.");

  userEvent.clear(screen.getByLabelText("Repeat password"));
  userEvent.type(screen.getByLabelText("Repeat password"), "mynewpassword");
  userEvent.click(screen.getByText("Change password"));

  await screen.findByText("Password changed");
});

test("shows error if no user with given email", async () => {
  renderWithRouter(<App />, "/forgotpassword");

  userEvent.type(screen.getByLabelText("Email address"), "invalid@email.com");
  userEvent.click(screen.getByText("Send password reset email"));

  await screen.findByText("There is no account with the given email address.");
});

test("can navigate to login page", async () => {
  renderWithRouter(<App />, "/forgotpassword");
  userEvent.click(screen.getByText("go back to sign-in page"));
  await expectPathnameToBe("/login");
});

test("shows error if could not recover account using recovery token", async () => {
  renderWithRouter(<App />, "/#recovery_token=notvalid");
  await screen.findByText("Something went wrong");
});
