import { createContext } from "@traveler-app/api/context";
import { appRouter } from "@traveler-app/api/routers/index";
import { auth } from "@traveler-app/auth";
import { env } from "@traveler-app/env/server";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { type Express } from "express";

const app: Express = express();

app.use(
	cors({
		origin: env.CORS_ORIGIN,
		methods: ["GET", "POST", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

app.all("/api/auth{/*path}", toNodeHandler(auth));

app.use(
	"/trpc",
	createExpressMiddleware({
		router: appRouter,
		createContext,
	}),
);

app.use(express.json());

app.get("/", (_req, res) => {
	res.status(200).send("OK");
});

export default app;
