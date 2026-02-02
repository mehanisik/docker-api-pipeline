import { describe, expect, test } from "bun:test";
import request from "supertest";
import { app } from "../server";

describe("GET /health-check", () => {
	test("returns status ok", async () => {
		const res = await request(app).get("/health-check");
		expect(res.status).toBe(200);
		expect(res.body).toEqual({ status: "ok" });
	});
});

describe("GET /version", () => {
	test("returns version info", async () => {
		const res = await request(app).get("/version");
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty("commit");
		expect(res.body).toHaveProperty("bun");
		expect(res.body).toHaveProperty("node");
	});
});
