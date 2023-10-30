import jwt from "jsonwebtoken";

export function generate_token(
  data: { email: string },
  expiresIn = "1d",
  secretKey = process.env.secret_key
): string {
  const { email } = data;
  const token = jwt.sign({ email }, secretKey || "", {
    expiresIn,
  });
  return token;
}
