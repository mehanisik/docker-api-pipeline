import pg from "pg";
import { logger } from "./logger";

const pool = new pg.Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: process.env.DATABASE_URL?.includes("sslmode")
		? { rejectUnauthorized: false }
		: undefined,
});

async function initialize(): Promise<void> {
	const connected = await checkConnection();
	if (connected) {
		logger.info("Database connected");
	} else {
		logger.warn("Database not reachable");
	}
}

async function checkConnection(): Promise<boolean> {
	try {
		await pool.query("SELECT 1");
		return true;
	} catch {
		return false;
	}
}

async function close(): Promise<void> {
	await pool.end();
	logger.info("Database pool closed");
}

export { initialize, checkConnection, close };
