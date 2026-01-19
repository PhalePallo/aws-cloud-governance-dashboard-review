// backend/src/scripts/seedLogs.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.AUDIT_TABLE_NAME || "aws-cloud-governance-audit-logs";

async function seed() {
  const sampleLogs = [
    { id: "1", timestamp: new Date().toISOString(), action: "CREATE", resource: "S3 Bucket" },
    { id: "2", timestamp: new Date().toISOString(), action: "UPDATE", resource: "Lambda Function" },
    { id: "3", timestamp: new Date().toISOString(), action: "DELETE", resource: "DynamoDB Table" },
  ];

  for (const log of sampleLogs) {
    try {
      await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: log }));
      console.log("Inserted log:", log);
    } catch (err) {
      console.error("Error inserting log:", err);
    }
  }
}

seed();
