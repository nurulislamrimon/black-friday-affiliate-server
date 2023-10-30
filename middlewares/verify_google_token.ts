import admin from "firebase-admin";
import serviceAccount from "../black-friday-affiliate-firebase-adminsdk-md5ie-8caae8c653.json";
import { NextFunction, Request, Response } from "express";

const verifyGoogleToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // for google  app initialize
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as unknown as string),
    });
  }
  // check the token is valid and set the payload to the req.user
  try {
    const googleAccessToken = req.body.accessToken;

    if (!googleAccessToken) {
      throw new Error("Provide a valid access token!");
    }
    const payload = (await admin
      .auth()
      .verifyIdToken(googleAccessToken)) as any;

    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};

export default verifyGoogleToken;
