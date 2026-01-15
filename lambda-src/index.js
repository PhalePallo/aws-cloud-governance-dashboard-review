// index.js
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

// Create a DynamoDB client
const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const tableName = process.env.AUDIT_TABLE_NAME;

export const handler = async (event) => {
  try {
    // Scan the DynamoDB table
    const command = new ScanCommand({ TableName: tableName });
    const result = await client.send(command);

    // Return results to API Gateway
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.Items || []), // Empty array if no items
    };
  } catch (error) {
    console.error("Lambda error:", error);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
