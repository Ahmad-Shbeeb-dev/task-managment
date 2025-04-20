// import { redirect as nextRedirect } from "next/navigation";

export class AuthRequiredError extends Error {
  constructor({
    message = "Auth is required to access this page.",
    redirect = false,
  }) {
    if (redirect) message = "UNAUTHORIZED";
    // if (redirect) nextRedirect("/signin");
    super(message);
    this.name = "AuthRequiredError";
  }
}
