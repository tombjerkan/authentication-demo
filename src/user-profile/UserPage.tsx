import { useLogout, useRequireAuth, useUser } from "../authentication/identity";

export default function UserPage() {
  useRequireAuth();
  const user = useUser();
  const logout = useLogout();

  if (!user) return null;

  return (
    <>
      {user!.fullName + " - " + user!.email}{" "}
      <button onClick={logout}>Logout</button>
    </>
  );
}
