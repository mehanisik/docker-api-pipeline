import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { logger } from "../logger";

const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID;

export function requestLogger(req: Request, res: Response, next: NextFunction) {
	const start = performance.now();
	const requestId =
		req.headers["x-request-id"]?.toString() || crypto.randomUUID();

	res.setHeader("x-request-id", requestId);

	res.on("finish", () => {
		const duration = Math.round(performance.now() - start);
		const traceHeader = req.headers["x-cloud-trace-context"]?.toString();

		const logData: Record<string, unknown> = {
			method: req.method,
			path: req.originalUrl,
			status: res.statusCode,
			duration,
			requestId,
		};

		if (traceHeader && GCP_PROJECT_ID) {
			const traceId = traceHeader.split("/")[0];
			logData["logging.googleapis.com/trace"] =
				`projects/${GCP_PROJECT_ID}/traces/${traceId}`;
		}

		const level =
			res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";
		logger[level](
			logData,
			`${req.method} ${req.originalUrl} ${res.statusCode}`,
		);
	});

	next();
}
