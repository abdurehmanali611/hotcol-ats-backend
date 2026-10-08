import jwt from "jsonwebtoken";

const JWT_Secret = process.env.JWT_Secret;
const ATS_ADMIN_TOKEN_KIND = "ats_admin";

export { JWT_Secret, ATS_ADMIN_TOKEN_KIND };

if (!JWT_Secret || String(JWT_Secret).trim() === "") {
  console.error(
    "[hotcol-ats] JWT_Secret is missing — tokens will fail verification. Set JWT_Secret in the environment.",
  );
}

/**
 * Bearer may be an ATS Admin session (kind ats_admin) issued by this API.
 */
export function authenticateRequest(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_Secret);
    if (payload?.kind !== ATS_ADMIN_TOKEN_KIND) {
      return null;
    }
    return payload;
  } catch (err) {
    if (err?.name === "TokenExpiredError") {
      return { __authExpired: true };
    }
    return null;
  }
}
