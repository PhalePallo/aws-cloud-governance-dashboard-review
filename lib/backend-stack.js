"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackendStack = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const lambda = __importStar(require("aws-cdk-lib/aws-lambda"));
const nodejs = __importStar(require("aws-cdk-lib/aws-lambda-nodejs"));
const apigw = __importStar(require("aws-cdk-lib/aws-apigateway"));
const iam = __importStar(require("aws-cdk-lib/aws-iam"));
const path = __importStar(require("path"));
class BackendStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        /**
         * =========================================================
         * IAM ROLE (LEAST PRIVILEGE)
         * =========================================================
         */
        const apiLambdaRole = new iam.Role(this, 'ApiLambdaRole', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        });
        apiLambdaRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'));
        /**
         * =========================================================
         * LAMBDA FUNCTION
         * =========================================================
         */
        const apiLambda = new nodejs.NodejsFunction(this, 'AuditApiHandler', {
            runtime: lambda.Runtime.NODEJS_20_X,
            entry: path.join(__dirname, '../../backend/src/handlers/getAuditLogs.ts'),
            handler: 'handler',
            memorySize: 128,
            timeout: cdk.Duration.seconds(10),
            role: apiLambdaRole,
        });
        /**
         * =========================================================
         * API GATEWAY (REST API)
         * =========================================================
         */
        const api = new apigw.RestApi(this, 'AuditApi', {
            restApiName: 'CloudGovernanceApi',
            defaultCorsPreflightOptions: {
                allowOrigins: apigw.Cors.ALL_ORIGINS,
                allowMethods: ['GET'],
            },
        });
        const auditLogs = api.root.addResource('audit-logs');
        auditLogs.addMethod('GET', new apigw.LambdaIntegration(apiLambda));
        this.apiUrl = api.url;
    }
}
exports.BackendStack = BackendStack;
