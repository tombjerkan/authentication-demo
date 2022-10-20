import App from "../App";
import { render, screen } from "@testing-library/react";
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

createUser("test@email.com", "testpassword", "Test User");

test("can request password reset email", async () => {
  renderWithRouter(<App />, "/forgotpassword");

  userEvent.type(screen.getByLabelText("Email address"), "test@email.com");
  userEvent.click(screen.getByText("Send password reset email"));

  expect(
    await screen.findByText("Password reset email sent")
  ).toBeInTheDocument();
});

test("shows error if no user with given email", async () => {
  renderWithRouter(<App />, "/forgotpassword");

  userEvent.type(screen.getByLabelText("Email address"), "invalid@email.com");
  userEvent.click(screen.getByText("Send password reset email"));

  expect(
    await screen.findByText("There is no account with the given email address.")
  ).toBeInTheDocument();
});

test("can navigate to login page", async () => {
  renderWithRouter(<App />, "/forgotpassword");
  userEvent.click(screen.getByText("go back to sign-in page"));
  await expectPathnameToBe("/login");
});

test("can change password if recovery token is present in url", async () => {
  const email = "test@email.com";
  identityService.recover(email);
  const token = identityService.getRecoveryTokenForUser(email);

  renderWithRouter(<App />, "/#recovery_token=" + token);

  await expectPathnameToBe("/forgotpassword");
  expect(await screen.findByText("Choose a new password")).toBeInTheDocument();
  userEvent.type(screen.getByLabelText("New password"), "mynewpassword");

  // Shows error if passwords aren't the same
  userEvent.type(screen.getByLabelText("Repeat password"), "anotherpassword");
  userEvent.click(screen.getByText("Change password"));
  expect(screen.getByText("Something went wrong.")).toBeInTheDocument();

  userEvent.clear(screen.getByLabelText("Repeat password"));
  userEvent.type(screen.getByLabelText("Repeat password"), "mynewpassword");
  userEvent.click(screen.getByText("Change password"));

  expect(await screen.findByText("Password changed")).toBeInTheDocument();
});

test("shows error if could not recover account using recovery token", async () => {
  renderWithRouter(<App />, "/#recovery_token=notvalid");
  expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
});
