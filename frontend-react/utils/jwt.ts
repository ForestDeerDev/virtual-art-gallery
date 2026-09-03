export interface JwtPayload {
  userId: number;
  role: string;
  sub: string;
  iat: number;
  exp: number;

  [key: string]: unknown;
}

export function parseJwtPayload(token: string): JwtPayload | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) {
      return null;
    }

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    const payload = JSON.parse(jsonPayload);

    if (typeof payload !== "object" || payload === null) {
      return null;
    }

    if (
      typeof payload.userId !== "number" ||
      typeof payload.role !== "string" ||
      typeof payload.sub !== "string" ||
      typeof payload.iat !== "number" ||
      typeof payload.exp !== "number"
    ) {
      return null;
    }

    return payload as JwtPayload;
  } catch (error) {
    console.error("Failed to parse JWT token:", error);
    return null;
  }
}

export function isTokenExpired(
  token: string,
  bufferSeconds: number = 60,
): boolean {
  if (!token) {
    return true;
  }

  const payload = parseJwtPayload(token);
  if (!payload || !payload.exp) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = payload.exp;

  return currentTime >= expirationTime - bufferSeconds;
}

export function getTokenExpirationTime(token: string): number | null {
  const payload = parseJwtPayload(token);
  return payload?.exp ?? null;
}

export function getTokenRemainingTime(token: string): number {
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) {
    return 0;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const remaining = expirationTime - currentTime;

  return Math.max(0, remaining);
}
