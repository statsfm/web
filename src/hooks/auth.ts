import auth from "~/auth";

export function useAuth(): auth {
  const ref = new auth();
  return ref;
}
