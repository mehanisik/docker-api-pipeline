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
		"/hello-world": {
			get: {
				summary: "SERVER_HELLO env value",
				operationId: "helloWorld",
				responses: {
					"200": {
						description: "Returns the SERVER_HELLO environment variable value",
						content: {
							"text/plain": {
								schema: { type: "string", example: "Hello World!" },
							},
						},
					},
				},
			},
		},
	},
};
