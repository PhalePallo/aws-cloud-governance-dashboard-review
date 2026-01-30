#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { FrontendStack } from '../../lib/frontend-stack';
import { BackendStack } from '../../lib/backend-stack';

const app = new cdk.App();

// Instantiate Frontend Stack (S3 + CloudFront)
new FrontendStack(app, 'FrontendStack', {});

// Instantiate Backend Stack (Lambda + API Gateway)
new BackendStack(app, 'BackendStack', {});
