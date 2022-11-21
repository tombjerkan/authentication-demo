import App from "../App";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { createUser, identityService } from "../msw-handlers";
import { faker } from "@faker-js/faker";

beforeEach(() => {
  identityService.reset();
});

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
  const email = faker.internet.email();
  createUser(email, faker.internet.password(), faker.name.fullName());
  renderWithRouter(<App />, "/forgotpassword");

  userEvent.type(screen.getByLabelText("Email address"), email);
  userEvent.click(screen.getByText("Send reset email"));

  await screen.findByText(
    /A link to reset your password has been sent to (.+)@(.+)./
  );

  // When the user follows the link in the recovery email they received, it
  // will be a fresh render of the whole app. To recreate this, we need to
  // completely unmount the app and start anew.
  cleanup();

  const token = identityService.getRecoveryTokenForUser(email);

  renderWithRouter(<App />, "/#recovery_token=" + token);

  await expectPathnameToBe("/forgotpassword");
  await screen.findByText("Choose a new password");

  const newPassword = faker.internet.password();

  userEvent.type(screen.getByLabelText("New password"), newPassword);

  // Shows error if passwords aren't the same
  userEvent.type(
    screen.getByLabelText("Repeat password"),
    faker.internet.password()
  );
  userEvent.click(screen.getByText("Change password"));
  screen.getByText("Something went wrong.");

  userEvent.clear(screen.getByLabelText("Repeat password"));
  userEvent.type(screen.getByLabelText("Repeat password"), newPassword);
  userEvent.click(screen.getByText("Change password"));

  await screen.findByText("Password changed");

  userEvent.click(screen.getByText("continue to the application"));
  await expectPathnameToBe("/user");
});

test("shows error if no user with given email", async () => {
  renderWithRouter(<App />, "/forgotpassword");

  userEvent.type(
    screen.getByLabelText("Email address"),
    faker.internet.email()
  );
  userEvent.click(screen.getByText("Send reset email"));

  await screen.findByText("No account exists for the given email address.");
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
