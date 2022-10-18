import App from "../App";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { createUser, createUserAwaitingConfirmation } from "../msw-handlers";

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

test("can create user", async () => {
  renderWithRouter(<App />, "/register");

  userEvent.type(screen.getByLabelText("Full name"), "New User");
  userEvent.type(screen.getByLabelText("Email address"), "newuser@email.com");
  userEvent.type(screen.getByLabelText("Password"), "mypassword");
  userEvent.click(screen.getByRole("button", { name: "Create account" }));

  expect(await screen.findByText("Success")).toBeInTheDocument();
});

test("shows error if existing user for given email", async () => {
  renderWithRouter(<App />, "/register");

  userEvent.type(screen.getByLabelText("Full name"), "New User");
  userEvent.type(screen.getByLabelText("Email address"), "test@email.com");
  userEvent.type(screen.getByLabelText("Password"), "mypassword");
  userEvent.click(screen.getByRole("button", { name: "Create account" }));

  expect(
    await screen.findByText("Could not create an account.")
  ).toBeInTheDocument();
});

test("can navigate to login page", async () => {
  renderWithRouter(<App />, "/register");
  userEvent.click(screen.getByText("sign in to an existing account"));
  await expectPathnameToBe("/login");
});

test("confirms account if confirmation token is present in url", async () => {
  const token = createUserAwaitingConfirmation(
    "needconfirm@email.com",
    "password",
    "Need Confirm"
  );
  renderWithRouter(<App />, "/#confirmation_token=" + token);

  await expectPathnameToBe("/register");
  expect(await screen.findByText("Account confirmed")).toBeInTheDocument();

  userEvent.click(screen.getByText("sign in to your account"));

  await expectPathnameToBe("/login");
});

test("shows error if could not confirm account using confirmation token", async () => {
  renderWithRouter(<App />, "/#confirmation_token=notvalid");
  expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
});
