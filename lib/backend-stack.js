"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackendStack = void 0;
var cdk = require("aws-cdk-lib");
var lambda = require("aws-cdk-lib/aws-lambda");
var nodejs = require("aws-cdk-lib/aws-lambda-nodejs");
var apigw = require("aws-cdk-lib/aws-apigateway");
var iam = require("aws-cdk-lib/aws-iam");
var path = require("path");
var BackendStack = /** @class */ (function (_super) {
    __extends(BackendStack, _super);
    function BackendStack(scope, id, props) {
        var _this = _super.call(this, scope, id, props) || this;
        /**
         * =========================================================
         * IAM ROLE (LEAST PRIVILEGE)
         * =========================================================
         */
        var apiLambdaRole = new iam.Role(_this, 'ApiLambdaRole', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        });
        apiLambdaRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'));
        /**
         * =========================================================
         * LAMBDA FUNCTION
         * =========================================================
         */
        var apiLambda = new nodejs.NodejsFunction(_this, 'AuditApiHandler', {
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
        var api = new apigw.RestApi(_this, 'AuditApi', {
            restApiName: 'CloudGovernanceApi',
            defaultCorsPreflightOptions: {
                allowOrigins: apigw.Cors.ALL_ORIGINS,
                allowMethods: ['GET'],
            },
        });
        var auditLogs = api.root.addResource('audit-logs');
        auditLogs.addMethod('GET', new apigw.LambdaIntegration(apiLambda));
        _this.apiUrl = api.url;
        return _this;
    }
    return BackendStack;
}(cdk.Stack));
exports.BackendStack = BackendStack;
