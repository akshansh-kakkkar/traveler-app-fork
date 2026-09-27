import { expo } from "@better-auth/expo";
import { createPrismaClient } from "@traveler-app/db";
import { env } from "@traveler-app/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export function createAuth() {
  const prisma = createPrismaClient();

  return betterAuth({
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),
    rateLimit: {
      enabled: true,
      window: 60,
      max: 100,

      customRules: {
        "/sign-in/email": {
          window: 60,
          max: 5,
        },
        "/sign-up/email": {
          window: 60,
          max: 5,
        },
      },
    },
    trustedOrigins: [
      env.CORS_ORIGIN,

      "traveler-app://",
      "exp://",
      "http://localhost:8081",
      "http://10.0.2.2:8081", // Android emulator
      "http://192.168.0.102:8081", // Real phone
    ],
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
    account: {
      accountLinking: {
        enabled: true,
      },
    },
    user: {
      deleteUser: {
        enabled: true,
      },
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    advanced: {
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      },
    },
    plugins: [expo()],
  });
}

export const auth = createAuth();
