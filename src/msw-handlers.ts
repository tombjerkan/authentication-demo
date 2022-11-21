import { rest } from "msw";
import { v4 as uuid } from "uuid";

import assert from "./common/assert";

const REFRESH_TOKEN = "<refresh_token>";

interface User {
  email: string;
  password: string;
  fullName: string;
}

type UserAwaitingConfirmation = User & { token: string };
type UserAwaitingRecovery = { email: string; token: string };

class IdentityService {
  getAccessToken(email: string, password: string) {
    const user = this.getUserByEmail(email);

    if (user === undefined || user.password !== password) {
      return null;
    }

    return encodeJwt({ email: user.email });
  }

  getUser(bearerToken: string) {
    const { email } = decodeJwt(bearerToken);
    const user = this.getUserByEmail(email);

    if (user === undefined) {
      return null;
    }

    return { email, fullName: user?.fullName };
  }

  signup(
    email: string,
    password: string,
    fullName: string
  ): { code: 200 | 400 } {
    const user = this.getUserByEmail(email);

    if (user !== undefined) {
      // TODO: handle properly
      return {
        code: 400,
      };
    }

    this.usersAwaitingConfirmation = [
      ...this.usersAwaitingConfirmation,
      {
        email,
        password,
        fullName,
        token: uuid(),
      },
    ];

    return { code: 200 };
  }

  verify(token: string): { code: 200; accessToken: string } | { code: 400 } {
    const userAwaitingConfirmation = this.usersAwaitingConfirmation.find(
      (user) => user.token === token
    );

    const userAwaitingRecovery = this.usersAwaitingRecovery.find(
      (u) => u.token === token
    );

    if (userAwaitingConfirmation !== undefined) {
      this.users = [
        ...this.users,
        {
          email: userAwaitingConfirmation.email,
          password: userAwaitingConfirmation.password,
          fullName: userAwaitingConfirmation.fullName,
        },
      ];

      return {
        code: 200,
        accessToken: encodeJwt({ email: userAwaitingConfirmation.email }),
      };
    } else if (userAwaitingRecovery !== undefined) {
      return {
        code: 200,
        accessToken: encodeJwt({ email: userAwaitingRecovery.email }),
      };
    } else {
      // TODO: properly
      return { code: 400 };
    }
  }

  recover(email: string): { code: 200 } | { code: 404 } {
    const user = this.getUserByEmail(email);

    if (user === undefined) {
      return { code: 404 };
    }

    this.usersAwaitingRecovery = [
      ...this.usersAwaitingRecovery,
      { email, token: uuid() },
    ];

    return { code: 200 };
  }

  updateUser(email: string, attributes: Omit<User, "email">) {
    const user = this.getUserByEmail(email);

    if (user === undefined) {
      return { code: 404 };
    }

    this.users = [
      ...this.users.filter((u) => u.email === email),
      { ...user, ...attributes },
    ];

    return { code: 200 };
  }

  private get users(): readonly User[] {
    const usersStorage = localStorage.getItem("msw/IdentityService/users");
    return usersStorage === null ? [] : JSON.parse(usersStorage);
  }

  private set users(users: readonly User[]) {
    localStorage.setItem("msw/IdentityService/users", JSON.stringify(users));
  }

  private get usersAwaitingConfirmation(): readonly UserAwaitingConfirmation[] {
    const usersAwaitingConfirmationStorage = localStorage.getItem(
      "msw/IdentityService/usersAwaitingConfirmation"
    );
    return usersAwaitingConfirmationStorage === null
      ? []
      : JSON.parse(usersAwaitingConfirmationStorage);
  }

  private set usersAwaitingConfirmation(
    users: readonly UserAwaitingConfirmation[]
  ) {
    localStorage.setItem(
      "msw/IdentityService/usersAwaitingConfirmation",
      JSON.stringify(users)
    );
  }

  private get usersAwaitingRecovery(): readonly UserAwaitingRecovery[] {
    const usersAwaitingRecoveryStorage = localStorage.getItem(
      "msw/IdentityService/usersAwaitingRecovery"
    );
    return usersAwaitingRecoveryStorage === null
      ? []
      : JSON.parse(usersAwaitingRecoveryStorage);
  }

  private set usersAwaitingRecovery(users: readonly UserAwaitingRecovery[]) {
    localStorage.setItem(
      "msw/IdentityService/usersAwaitingRecovery",
      JSON.stringify(users)
    );
  }

  private getUserByEmail(email: string) {
    return this.users.find((u) => u.email === email);
  }

  getConfirmationTokenForUser(email: string) {
    return this.usersAwaitingConfirmation.find((u) => u.email === email)?.token;
  }

  getRecoveryTokenForUser(email: string) {
    return this.usersAwaitingRecovery.find((u) => u.email === email)?.token;
  }

  reset() {
    this.users = [];
    this.usersAwaitingConfirmation = [];
    this.usersAwaitingRecovery = [];
  }
}

export const identityService = new IdentityService();

export function createUser(email: string, password: string, fullName: string) {
  identityService.signup(email, password, fullName);
  const confirmationToken = identityService.getConfirmationTokenForUser(email);
  assert(
    confirmationToken !== undefined,
    "token should be defined as it was created in this same function"
  );
  identityService.verify(confirmationToken);
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

      const token = identityService.getAccessToken(email, password);

      if (token === null) {
        return res(
          ctx.status(400),
          ctx.json({
            error: "invalid_grant",
            error_description:
              "No user found with that email, or password invalid.",
          })
        );
      }

      return res(
        ctx.json({
          access_token: token,
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

      const user = identityService.getUser(token);
      assert(
        user !== null,
        "should not be able to pass invalid token in mocks"
      );

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

      const result = identityService.signup(email, password, fullName);

      if (result.code !== 200) {
        return res(
          ctx.status(400),
          ctx.json({
            code: 400,
            msg: "A user with this email address has already been registered",
          })
        );
      }

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
      const { token: confirmationToken } = JSON.parse(await req.text()) as {
        token?: string;
      };
      assert(confirmationToken !== undefined);

      const result = identityService.verify(confirmationToken);

      if (result.code === 400) {
        return res(ctx.status(400));
      }

      return res(
        ctx.json({
          access_token: result.accessToken,
          token_type: "bearer",
          expires_in: 3600,
          refresh_token: REFRESH_TOKEN,
        })
      );
    }
  ),
  rest.post(
    "https://bjerkandemo.netlify.app/.netlify/identity/recover",
    async (req, res, ctx) => {
      const { email } = JSON.parse(await req.text()) as {
        email?: string;
      };
      assert(email !== undefined);

      const result = identityService.recover(email);

      if (result.code !== 200) {
        return res(
          ctx.status(404),
          ctx.json({
            code: 404,
            msg: "User not found",
          })
        );
      }

      return res(
        ctx.json({
          email,
        })
      );
    }
  ),
  rest.put(
    "https://bjerkandemo.netlify.app/.netlify/identity/user",
    async (req, res, ctx) => {
      const authorizationHeader = req.headers.get("Authorization");
      assert(authorizationHeader !== null);
      assert(authorizationHeader.startsWith("Bearer "));
      const token = authorizationHeader.slice("Bearer ".length);
      const { email } = decodeJwt(token);

      const attributes = await req.json();

      identityService.updateUser(email, attributes);

      return res(ctx.status(200));
    }
  ),
];

export default handlers;
