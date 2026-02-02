export const swaggerSpec = {
	openapi: "3.0.0",
	info: {
		title: "DevOps Task 1 API",
		version: "1.0.0",
		description: "Docker API Pipeline",
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
		"/version": {
			get: {
				summary: "Build and runtime version info",
				operationId: "version",
				responses: {
					"200": {
						description: "Returns build commit SHA and runtime versions",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										commit: { type: "string", example: "a1b2c3d" },
										bun: { type: "string", example: "1.3.8" },
										node: { type: "string", example: "v22.0.0" },
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
