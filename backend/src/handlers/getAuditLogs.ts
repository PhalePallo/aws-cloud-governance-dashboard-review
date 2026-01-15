import { getAuditLogs } from "../getAuditLogs";

describe("getAuditLogs", () => {
  test("returns audit logs successfully", async () => {
    const result = await getAuditLogs();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });
});
