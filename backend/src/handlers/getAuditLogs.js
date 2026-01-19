"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogs = void 0;
const dynamodb_1 = require("../services/dynamodb");
const getAuditLogs = async () => {
    try {
        const logs = await (0, dynamodb_1.fetchLogs)();
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(logs)
        };
    }
    catch (error) {
        console.error("Error fetching audit logs", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error" })
        };
    }
};
exports.getAuditLogs = getAuditLogs;
