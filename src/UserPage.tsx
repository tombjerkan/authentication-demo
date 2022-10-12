import { useRequireAuth, useUser } from "./AuthProvider";

export default function UserPage() {
  useRequireAuth();
  const user = useUser();

  if (!user) return null;

  return <>{user!.fullName + " - " + user!.email}</>;
}
