import { rest } from "msw";
import { v4 as uuid } from "uuid";

import assert from "./common/assert";

const REFRESH_TOKEN = "<refresh_token>";

const usersStorage = localStorage.getItem("msw/users");
const users: { email: string; password: string; fullName: string }[] =
  usersStorage === null ? [] : JSON.parse(usersStorage);

const usersAwaitingConfirmationStorage = localStorage.getItem(
  "msw/usersAwaitingConfirmation"
);
const usersAwaitingConfirmation: {
  email: string;
  password: string;
  fullName: string;
  token: string;
}[] =
  usersAwaitingConfirmationStorage === null
    ? []
    : JSON.parse(usersAwaitingConfirmationStorage);

export function createUser(email: string, password: string, fullName: string) {
  users.push({ email, password, fullName });
  localStorage.setItem("msw/users", JSON.stringify(users));
}

export function createUserAwaitingConfirmation(
  email: string,
  password: string,
  fullName: string
) {
  const token = uuid();
  usersAwaitingConfirmation.push({ email, password, fullName, token });
  localStorage.setItem(
    "msw/usersAwaitingConfirmation",
    JSON.stringify(usersAwaitingConfirmation)
  );
  return token;
}

function getUserByEmail(email: string) {
  return users.find((u) => u.email === email);
}

function encodeJwt(data: object = {}) {
  // There are more properties in the actual payload, but they do not seem to be needed
  const payload = {
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
    ...data,
  };

  return `<header>.${btoa(JSON.stringify(payload))}.<signature>`;
}

function decodeJwt(jwt: string) {
  const encodedPayload = jwt.split(".")[1];
  const payload = JSON.parse(atob(encodedPayload));
  return payload;
}

const handlers = [
  rest.post(
    "https://bjerkandemo.netlify.app/.netlify/identity/token",
    async (req, res, ctx) => {
      const body = new URLSearchParams(await req.text());
      const email = body.get("username");
      const password = body.get("password");
      assert(email !== null);
      assert(password !== null);
      const user = getUserByEmail(email);

      if (user === undefined || user.password !== password) {
        return res(
          ctx.status(400),
          ctx.body(
            JSON.stringify({
              error: "invalid_grant",
              error_description:
                "No user found with that email, or password invalid.",
            })
          )
        );
      }

      return res(
        ctx.json({
          access_token: encodeJwt({ email: user.email }),
          token_type: "bearer",
          expires_in: 3600,
          refresh_token: REFRESH_TOKEN,
        })
      );
    }
  ),
  rest.get(
    "https://bjerkandemo.netlify.app/.netlify/identity/user",
    async (req, res, ctx) => {
      const authorizationHeader = req.headers.get("Authorization");
      assert(authorizationHeader !== null);
      assert(authorizationHeader.startsWith("Bearer "));
      const token = authorizationHeader.slice("Bearer ".length);
      const { email } = decodeJwt(token);
      const user = getUserByEmail(email);
      assert(user !== undefined);

      return res(
        ctx.json({
          email: email,
          user_metadata: { fullName: user.fullName },
        })
      );
    }
  ),
  rest.post(
    "https://bjerkandemo.netlify.app/.netlify/identity/signup",
    async (req, res, ctx) => {
      const { email, password, data } = JSON.parse(await req.text()) as {
        email?: string;
        password?: string;
        data?: { fullName?: string };
      };
      assert(email !== undefined);
      assert(password !== undefined);
      assert(data !== undefined);

      const { fullName } = data;
      assert(fullName !== undefined);

      const user = getUserByEmail(email);

      if (user !== undefined) {
        return res(
          ctx.status(400),
          ctx.json({
            code: 400,
            msg: "A user with this email address has already been registered",
          })
        );
      }

      createUserAwaitingConfirmation(email, password, fullName);

      return res(
        ctx.json({
          email,
          user_metadata: { fullName },
        })
      );
    }
  ),
  rest.post(
    "https://bjerkandemo.netlify.app/.netlify/identity/verify",
    async (req, res, ctx) => {
      const { token } = JSON.parse(await req.text()) as { token?: string };
      assert(token !== undefined);

      const match = usersAwaitingConfirmation.find(
        (pair) => pair.token === token
      );

      if (match === undefined) {
        return res(ctx.status(400), ctx.json({}));
      }

      const user = usersAwaitingConfirmation.find(
        (user) => user.email === match.email
      );
      assert(user !== undefined);
      createUser(user.email, user.password, user.fullName);

      return res(
        ctx.json({
          access_token: encodeJwt({ email: user.email }),
          token_type: "bearer",
          expires_in: 3600,
          refresh_token: REFRESH_TOKEN,
        })
      );
    }
  ),
];

export default handlers;
