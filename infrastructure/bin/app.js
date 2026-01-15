#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cdk = require("aws-cdk-lib");
var s3_cloudfront_stack_1 = require("../lib/s3-cloudfront-stack");
var api_gateway_stack_1 = require("../lib/api-gateway-stack");
var app = new cdk.App();
// Instantiate S3 + CloudFront stack
new s3_cloudfront_stack_1.S3CloudFrontStack(app, 'S3CloudFrontStack', {});
// Instantiate API Gateway + Lambda stack
new api_gateway_stack_1.ApiGatewayStack(app, 'ApiGatewayStack', {});
