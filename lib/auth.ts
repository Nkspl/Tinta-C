export type AuthenticatedUser = {
  email: string;
  displayName: string;
};

const EMAIL_HEADER = "oai-authenticated-user-email";
const NAME_HEADER = "oai-authenticated-user-full-name";
const NAME_ENCODING_HEADER = "oai-authenticated-user-full-name-encoding";

export function userFromHeaders(headers: Headers): AuthenticatedUser | null {
  const email = headers.get(EMAIL_HEADER)?.trim().toLowerCase();
  if (!email) return null;

  const encodedName = headers.get(NAME_HEADER);
  let displayName = email.split("@")[0];
  if (encodedName && headers.get(NAME_ENCODING_HEADER) === "percent-encoded-utf-8") {
    try {
      displayName = decodeURIComponent(encodedName).trim() || displayName;
    } catch {
      // A malformed optional name must never block authentication.
    }
  }

  return { email, displayName };
}

export function apiUser(request: Request): AuthenticatedUser | null {
  const user = userFromHeaders(request.headers);
  if (user) return user;
  if (process.env.NODE_ENV !== "production") return { email: "preview@tinta.local", displayName: "Nikens" };
  return null;
}
