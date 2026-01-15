const iam = require('aws-cdk-lib/aws-iam');

function createLambdaRole(scope, id) {
  return new iam.Role(scope, id, {
    assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    managedPolicies: [
      iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
    ],
  });
}

module.exports = { createLambdaRole };
