import "dotenv/config";
import * as db from "./db";
import { app, logger } from "./server";

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "localhost";
const NODE_ENV = process.env.NODE_ENV || "development";

await db.initialize();

const server = app.listen(PORT, () => {
	logger.info(`Server (${NODE_ENV}) running on http://${HOST}:${PORT}`);
});

const onCloseSignal = () => {
	logger.info("sigint received, shutting down");
	server.close(async () => {
		await db.close();
		logger.info("server closed");
		process.exit();
	});
	setTimeout(() => process.exit(1), 10000).unref();
};

process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);
