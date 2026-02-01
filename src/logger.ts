import { pino } from "pino";

const isGCP = !!process.env.K_SERVICE;

const gcpSeverityLevels: Record<string, string> = {
	"10": "DEBUG",
	"20": "DEBUG",
	"30": "INFO",
	"40": "WARNING",
	"50": "ERROR",
	"60": "CRITICAL",
};

export const logger = pino({
	level: process.env.LOG_LEVEL || "info",
	...(isGCP && {
		messageKey: "message",
		formatters: {
			level(_label: string, number: number) {
				return { severity: gcpSeverityLevels[String(number)] || "DEFAULT" };
			},
		},
	}),
});
