import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

// Create a DynamoDB client
const client = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client); // Wrap in DocumentClient for plain JSON
const tableName = process.env.AUDIT_TABLE_NAME;

export const handler = async (event) => {
  try {
    // Scan the DynamoDB table
    const command = new ScanCommand({ TableName: tableName });
    const result = await docClient.send(command);

    // Return results to API Gateway
    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // important for CORS
      },
      body: JSON.stringify(result.Items || []), // Plain JSON now
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
