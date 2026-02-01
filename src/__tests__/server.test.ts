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

describe("GET /hello-world", () => {
	test("returns default greeting", async () => {
		const res = await request(app).get("/hello-world");
		expect(res.status).toBe(200);
		expect(res.text).toContain("Hello World");
	});
});
