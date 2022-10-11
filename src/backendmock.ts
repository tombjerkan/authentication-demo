export async function login(
  email: string,
  password: string
): Promise<
  { isSuccess: true; email: string; fullName: string } | { isSuccess: false }
> {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve(
          email === "tom@email.com" && password === "pass"
            ? { isSuccess: true, email: "tom", fullName: "Thomas Bjerkan " }
            : { isSuccess: false }
        ),
      3000
    )
  );
}
