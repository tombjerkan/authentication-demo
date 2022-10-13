export async function loginMock(
  email: string,
  password: string
): Promise<
  { isSuccess: true; email: string; fullName: string } | { isSuccess: false }
> {
  const users = readUsersFromStorage();
  const user = users.find((u) => u.email === email && u.password === password);

  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve(
          user !== undefined
            ? { isSuccess: true, email: user.email, fullName: user.fullName }
            : { isSuccess: false }
        ),
      3000
    )
  );
}

export async function registerMock(
  fullName: string,
  email: string,
  password: string
): Promise<boolean> {
  const users = readUsersFromStorage();
  const isEmailAlreadyRegistered = users.some((u) => u.email === email);
  const isRegisterSuccessful = !isEmailAlreadyRegistered;

  if (isRegisterSuccessful) {
    localStorage.setItem(
      "users",
      JSON.stringify([...users, { fullName, email, password }])
    );
  }

  return new Promise((resolve) =>
    setTimeout(() => resolve(isRegisterSuccessful), 2000)
  );
}

function readUsersFromStorage() {
  const usersJsonString = localStorage.getItem("users");
  const users: { email: string; password: string; fullName: string }[] =
    usersJsonString === null ? [] : JSON.parse(usersJsonString);
  return users;
}
