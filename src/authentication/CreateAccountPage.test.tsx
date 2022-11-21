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

test("can create user", async () => {
  const email = faker.internet.email();
  renderWithRouter(<App />, "/register");

  userEvent.type(screen.getByLabelText("Full name"), faker.name.fullName());
  userEvent.type(screen.getByLabelText("Email address"), email);
  userEvent.type(screen.getByLabelText("Password"), faker.internet.password());
  userEvent.click(screen.getByRole("button", { name: "Create account" }));

  await screen.findByText(
    /A link to confirm your new account has been sent to (.+)@(.+)\./
  );

  // When the user follows the link in the confirmation email they received, it
  // will be a fresh render of the whole app. To recreate this, we need to
  // completely unmount the app and start anew.
  cleanup();

  const confirmationToken = identityService.getConfirmationTokenForUser(email);
  renderWithRouter(<App />, "/#confirmation_token=" + confirmationToken);

  expectPathnameToBe("/register");
  await screen.findByText("Account confirmed");

  userEvent.click(screen.getByText("sign in to your account"));

  await expectPathnameToBe("/login");
});

test("shows error if existing user for given email", async () => {
  const existingEmail = faker.internet.email();
  createUser(existingEmail, faker.internet.password(), faker.name.fullName());
  renderWithRouter(<App />, "/register");

  userEvent.type(screen.getByLabelText("Full name"), faker.name.fullName());
  userEvent.type(screen.getByLabelText("Email address"), existingEmail);
  userEvent.type(screen.getByLabelText("Password"), faker.internet.password());
  userEvent.click(screen.getByRole("button", { name: "Create account" }));

  await screen.findByText("Could not create an account.");
});

test("can navigate to login page", async () => {
  renderWithRouter(<App />, "/register");
  userEvent.click(screen.getByText("sign in to an existing account"));
  await expectPathnameToBe("/login");
});

test("shows error if could not confirm account using confirmation token", async () => {
  renderWithRouter(<App />, "/#confirmation_token=notvalid");
  await screen.findByText("Something went wrong");
});
