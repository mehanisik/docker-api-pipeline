import couchbase from "couchbase";
import { logger } from "./logger";

let cluster: couchbase.Cluster | null = null;
let bucket: couchbase.Bucket | null = null;

function isConfigured(): boolean {
	return !!(
		process.env.COUCHBASE_URL &&
		process.env.COUCHBASE_USERNAME &&
		process.env.COUCHBASE_PASSWORD &&
		process.env.COUCHBASE_BUCKET
	);
}

async function initialize(): Promise<void> {
	if (!isConfigured()) {
		logger.info("Skipping database initialization - Couchbase not configured");
		return;
	}

	try {
		cluster = await couchbase.connect(process.env.COUCHBASE_URL!, {
			username: process.env.COUCHBASE_USERNAME!,
			password: process.env.COUCHBASE_PASSWORD!,
			configProfile: "wanDevelopment",
		});
		bucket = cluster.bucket(process.env.COUCHBASE_BUCKET!);
		const connected = await checkConnection();
		if (connected) {
			logger.info("Couchbase connected");
		} else {
			logger.warn("Couchbase not reachable");
		}
	} catch (err) {
		logger.warn({ err }, "Failed to connect to Couchbase");
	}
}

async function checkConnection(): Promise<boolean> {
	if (!cluster) return false;
	try {
		const result = await cluster.ping();
		const services = Object.values(result.services ?? {}).flat();
		return services.some((s) => s.state === couchbase.PingState.Ok);
	} catch {
		return false;
	}
}

async function getHealthInfo(): Promise<{
	connected: boolean;
	latencyMs: number | null;
	services: Record<string, string>;
}> {
	if (!cluster) {
		return { connected: false, latencyMs: null, services: {} };
	}

	try {
		const start = performance.now();
		const result = await cluster.ping();
		const latencyMs = Math.round(performance.now() - start);

		const services: Record<string, string> = {};
		for (const [name, endpoints] of Object.entries(result.services ?? {})) {
			const states = (endpoints as Array<{ state: number }>).map(
				(e) => e.state,
			);
			services[name] = states.every((s) => s === couchbase.PingState.Ok)
				? "ok"
				: "degraded";
		}

		const connected = Object.values(services).some((s) => s === "ok");
		return { connected, latencyMs, services };
	} catch {
		return { connected: false, latencyMs: null, services: {} };
	}
}

async function getClusterInfo(): Promise<Record<string, unknown>> {
	if (!cluster) {
		return { configured: false };
	}

	try {
		const diag = await cluster.diagnostics();
		const stateLabels: Record<number, string> = {
			[couchbase.EndpointState.Disconnected]: "disconnected",
			[couchbase.EndpointState.Connecting]: "connecting",
			[couchbase.EndpointState.Connected]: "connected",
			[couchbase.EndpointState.Disconnecting]: "disconnecting",
		};

		return {
			configured: true,
			id: diag.id,
			version: diag.version,
			services: Object.fromEntries(
				Object.entries(diag.services ?? {}).map(([name, endpoints]) => [
					name,
					(endpoints as Array<{ state: number; remote: string }>).map((e) => ({
						state: stateLabels[e.state] ?? String(e.state),
						remote: e.remote,
					})),
				]),
			),
		};
	} catch {
		return {
			configured: true,
			error: "Failed to retrieve cluster diagnostics",
		};
	}
}

async function close(): Promise<void> {
	if (cluster) {
		await cluster.close();
		cluster = null;
		bucket = null;
		logger.info("Couchbase connection closed");
	}
}

export {
	initialize,
	checkConnection,
	getHealthInfo,
	getClusterInfo,
	close,
	bucket,
	cluster,
};
