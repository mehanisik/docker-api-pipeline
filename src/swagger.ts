export const swaggerSpec = {
	openapi: "3.0.0",
	info: {
		title: "Buildbox API",
		version: "1.0.0",
		description: "Buildbox API",
	},
	paths: {
		"/health-check": {
			get: {
				summary: "Service health status",
				operationId: "healthCheck",
				responses: {
					"200": {
						description: "Service is healthy",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										status: { type: "string", example: "ok" },
									},
								},
							},
						},
					},
				},
			},
		},
		"/db/health": {
			get: {
				summary: "Database health and latency",
				operationId: "dbHealth",
				responses: {
					"200": {
						description: "Database is connected",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										connected: { type: "boolean", example: true },
										latencyMs: { type: "number", example: 42 },
										services: {
											type: "object",
											additionalProperties: { type: "string" },
											example: { kv: "ok", query: "ok" },
										},
									},
								},
							},
						},
					},
					"503": {
						description: "Database is not connected",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										connected: { type: "boolean", example: false },
										latencyMs: {
											type: "number",
											nullable: true,
											example: null,
										},
										services: { type: "object", example: {} },
									},
								},
							},
						},
					},
				},
			},
		},
		"/db/info": {
			get: {
				summary: "Database cluster information",
				operationId: "dbInfo",
				responses: {
					"200": {
						description: "Cluster metadata",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										configured: { type: "boolean" },
										id: { type: "string" },
										version: { type: "number" },
										services: { type: "object" },
									},
								},
							},
						},
					},
				},
			},
		},
	},
};
