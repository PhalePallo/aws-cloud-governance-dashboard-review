import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

export class BackendStack extends cdk.Stack {
  public readonly apiUrl: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * =========================================================
     * IAM ROLE (LEAST PRIVILEGE)
     * =========================================================
     */
    const apiLambdaRole = new iam.Role(
      this,
      'ApiLambdaRole',
      {
        assumedBy: new iam.ServicePrincipal(
          'lambda.amazonaws.com'
        ),
      }
    );

    apiLambdaRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        'service-role/AWSLambdaBasicExecutionRole'
      )
    );

    /**
     * =========================================================
     * LAMBDA FUNCTION
     * =========================================================
     */
    const apiLambda = new nodejs.NodejsFunction(
      this,
      'AuditApiHandler',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(
          __dirname,
          '../../backend/src/handlers/getAuditLogs.ts'
        ),
        handler: 'handler',
        memorySize: 128,
        timeout: cdk.Duration.seconds(10),
        role: apiLambdaRole,
      }
    );

    /**
     * =========================================================
     * API GATEWAY (REST API)
     * =========================================================
     */
    const api = new apigw.RestApi(
      this,
      'AuditApi',
      {
        restApiName: 'CloudGovernanceApi',
        defaultCorsPreflightOptions: {
          allowOrigins: apigw.Cors.ALL_ORIGINS,
          allowMethods: ['GET'],
        },
      }
    );

    const auditLogs = api.root.addResource('audit-logs');

    auditLogs.addMethod(
      'GET',
      new apigw.LambdaIntegration(apiLambda)
    );

    this.apiUrl = api.url;
  }
}
