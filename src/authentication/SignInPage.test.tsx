import App from "../App";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { createUser, identityService } from "../msw-handlers";
import { faker } from "@faker-js/faker";

beforeEach(() => {
  identityService.reset();
});

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

test("can login with valid user email and password", async () => {
  const email = faker.internet.email();
  const password = faker.internet.password();
  createUser(email, password, faker.name.fullName());
  renderWithRouter(<App />);

  userEvent.type(screen.getByLabelText("Email address"), email);
  userEvent.type(screen.getByLabelText("Password"), password);
  userEvent.click(screen.getByRole("button", { name: "Sign in" }));

  await waitFor(() => expectPathnameToBe("/user"));
});

test("shows error if invalid user email is entered", async () => {
  renderWithRouter(<App />);

  userEvent.type(
    screen.getByLabelText("Email address"),
    faker.internet.email()
  );
  userEvent.type(screen.getByLabelText("Password"), faker.internet.password());
  userEvent.click(screen.getByRole("button", { name: "Sign in" }));

  expect(
    await screen.findByText("Incorrect email and password combination.")
  ).toBeInTheDocument();
});

test("shows error if invalid password is entered", async () => {
  const email = faker.internet.email();
  createUser(email, faker.internet.password(), faker.name.fullName());
  renderWithRouter(<App />);

  userEvent.type(screen.getByLabelText("Email address"), email);
  userEvent.type(screen.getByLabelText("Password"), faker.internet.password());
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
