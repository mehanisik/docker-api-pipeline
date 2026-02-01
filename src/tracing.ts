import { TraceExporter } from "@google-cloud/opentelemetry-cloud-trace-exporter";
import { gcpDetector } from "@opentelemetry/resource-detector-gcp";
import { NodeSDK } from "@opentelemetry/sdk-node";

if (process.env.K_SERVICE) {
	const sdk = new NodeSDK({
		traceExporter: new TraceExporter(),
		resourceDetectors: [gcpDetector],
		instrumentations: [
			new (
				await import("@opentelemetry/instrumentation-http")
			).HttpInstrumentation(),
			new (
				await import("@opentelemetry/instrumentation-express")
			).ExpressInstrumentation(),
		],
	});

	sdk.start();

	const shutdown = async () => {
		await sdk.shutdown();
	};

	process.on("SIGTERM", shutdown);
	process.on("SIGINT", shutdown);
}
