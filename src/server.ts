import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import swaggerUi from "swagger-ui-express";

import { logger } from "./logger";
import { requestLogger } from "./middleware/request-logger";
import { swaggerSpec } from "./swagger";

const app: Express = express();

app.set("trust proxy", true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true }));
app.use(requestLogger);

app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health-check", (_req: Request, res: Response) => {
	res.json({ status: "ok" });
});

app.get("/hello-world", (_req: Request, res: Response) => {
	const message = process.env.SERVER_HELLO || "Hello World!";
	res.send(message);
});

export { app, logger };
