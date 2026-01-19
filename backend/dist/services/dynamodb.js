"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchLogs = fetchLogs;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client = new client_dynamodb_1.DynamoDBClient({});
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.AUDIT_TABLE_NAME;
async function fetchLogs() {
    const command = new lib_dynamodb_1.ScanCommand({
        TableName: TABLE_NAME,
        Limit: 50
    });
    const response = await docClient.send(command);
    return response.Items ?? [];
}
