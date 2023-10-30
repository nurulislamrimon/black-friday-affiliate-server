import jwt from "jsonwebtoken";

interface IPayload {
  email: string;
}

export const getPayloadFromToken = (
  token: string,
  secret_key = process.env.secret_key
) => {
  const secret = secret_key || "";
  return jwt.verify(token, secret) as IPayload;
};
