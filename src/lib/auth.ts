import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

interface UserJwtPayload {
  jti: string;
  iat: number;
  id: string;
  email: string;
  name: string;
  role: string;
}

export const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET_KEY || "super-secret-jwt-key-nks-electric-2024";
  if (!secret || secret.length === 0) {
    throw new Error("The environment variable JWT_SECRET_KEY is not set.");
  }
  return new TextEncoder().encode(secret);
};

export const verifyAuth = async (token?: string) => {
  try {
    let jwtToken = token;
    if (!jwtToken) {
      const cookieStore = await cookies();
      jwtToken = cookieStore.get("nks_admin_token")?.value;
    }
    if (!jwtToken) return null;

    const verified = await jwtVerify(jwtToken, getJwtSecretKey());
    return verified.payload as unknown as UserJwtPayload;
  } catch (err) {
    return null;
  }
};

export const createToken = async (payload: { id: string; email: string; name: string; role: string }) => {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setJti(crypto.randomUUID())
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getJwtSecretKey());

  return token;
};
