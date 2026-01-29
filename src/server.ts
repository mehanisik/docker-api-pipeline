import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import helmet from "helmet";
import { pino } from "pino";
const __dirname = dirname(fileURLToPath(import.meta.url));

const logger = pino({ name: "server start" });
const app: Express = express();

app.set("trust proxy", true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true }));
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				scriptSrc: ["'self'", "'unsafe-inline'"],
			},
		},
	}),
);

app.use("/home", express.static(join(__dirname, "public")));

app.get("/health-check", (_req: Request, res: Response) => {
	res.json({ status: "ok" });
});

app.get("/hello-world", (_req: Request, res: Response) => {
	const message = process.env.SERVER_HELLO || "Hello World!";
	res.send(message);
});

export { app, logger };
