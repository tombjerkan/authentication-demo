import App from "../App";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { createUser } from "../msw-handlers";

const renderWithRouter = (
  ui: Parameters<typeof render>[0],
  options?: Parameters<typeof render>[1]
) =>
  render(
    <MemoryRouter initialEntries={["/login"]}>
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

test("can login with valid user email and password", async () => {
  renderWithRouter(<App />);

  userEvent.type(screen.getByLabelText("Email address"), "test@email.com");
  userEvent.type(screen.getByLabelText("Password"), "testpassword");
  userEvent.click(screen.getByRole("button", { name: "Sign in" }));

  await waitFor(() => expectPathnameToBe("/user"));
});

test("shows error if invalid user email is entered", async () => {
  renderWithRouter(<App />);

  userEvent.type(screen.getByLabelText("Email address"), "invalid@email.com");
  userEvent.type(screen.getByLabelText("Password"), "testpassword");
  userEvent.click(screen.getByRole("button", { name: "Sign in" }));

  expect(
    await screen.findByText("Incorrect email and password combination.")
  ).toBeInTheDocument();
});

test("shows error if invalid password is entered", async () => {
  renderWithRouter(<App />);

  userEvent.type(screen.getByLabelText("Email address"), "test@email.com");
  userEvent.type(screen.getByLabelText("Password"), "invalidpassword");
  userEvent.click(screen.getByRole("button", { name: "Sign in" }));

  expect(
    await screen.findByText("Incorrect email and password combination.")
  ).toBeInTheDocument();
});

test("can navigate to create account page", async () => {
  renderWithRouter(<App />);
  userEvent.click(screen.getByText("create an account"));
  await expectPathnameToBe("/register");
});

test("can navigate to forgot password page", async () => {
  renderWithRouter(<App />);
  userEvent.click(screen.getByText("Forgot your password?"));
  await expectPathnameToBe("/forgotpassword");
});
