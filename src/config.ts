import { logger } from "./logger";

interface Config {
	port: number;
	host: string;
	nodeEnv: string;
	corsOrigins: string[];
	couchbaseUrl: string | undefined;
	couchbaseUsername: string | undefined;
	couchbasePassword: string | undefined;
	couchbaseBucket: string | undefined;
}

function validateEnv(): Config {
	const warnings: string[] = [];

	const port = Number(process.env.PORT) || 8000;
	const host = process.env.HOST || "localhost";
	const nodeEnv = process.env.NODE_ENV || "development";
	const corsOrigin = process.env.CORS_ORIGIN;
	const couchbaseUrl = process.env.COUCHBASE_URL;
	const couchbaseUsername = process.env.COUCHBASE_USERNAME;
	const couchbasePassword = process.env.COUCHBASE_PASSWORD;
	const couchbaseBucket = process.env.COUCHBASE_BUCKET;

	if (!corsOrigin && nodeEnv === "production") {
		warnings.push(
			"CORS_ORIGIN not set in production - API will reject cross-origin requests",
		);
	}

	if (
		!couchbaseUrl ||
		!couchbaseUsername ||
		!couchbasePassword ||
		!couchbaseBucket
	) {
		warnings.push(
			"Couchbase not configured - database features will be disabled",
		);
	}

	const corsOrigins = corsOrigin
		? corsOrigin.split(",").map((o) => o.trim())
		: [];

	if (corsOrigins.includes("*") && nodeEnv === "production") {
		warnings.push(
			"CORS_ORIGIN contains wildcard (*) in production - this is insecure",
		);
	}

	for (const warning of warnings) {
		logger.warn(warning);
	}

	return {
		port,
		host,
		nodeEnv,
		corsOrigins,
		couchbaseUrl,
		couchbaseUsername,
		couchbasePassword,
		couchbaseBucket,
	};
}

export { validateEnv, type Config };
