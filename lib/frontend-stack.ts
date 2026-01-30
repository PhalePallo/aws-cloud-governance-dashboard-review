import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export class FrontendStack extends cdk.Stack {
  public readonly distributionDomainName: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * =========================================================
     * S3 BUCKET (STATIC WEBSITE ORIGIN)
     * =========================================================
     * - Private bucket
     * - No public access
     * - CloudFront is the only reader
     */
    const siteBucket = new s3.Bucket(this, 'FrontendBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    /**
     * =========================================================
     * CLOUD FRONT ORIGIN ACCESS CONTROL (MODERN REPLACEMENT FOR OAI)
     * =========================================================
     */
    const oac = new cloudfront.CfnOriginAccessControl(
      this,
      'FrontendOAC',
      {
        originAccessControlConfig: {
          name: 'FrontendOAC',
          originAccessControlOriginType: 's3',
          signingBehavior: 'always',
          signingProtocol: 'sigv4',
        },
      }
    );

    /**
     * =========================================================
     * SECURITY HEADERS POLICY
     * =========================================================
     */
    const securityHeadersPolicy =
      new cloudfront.ResponseHeadersPolicy(
        this,
        'SecurityHeadersPolicy',
        {
          securityHeadersBehavior: {
            contentSecurityPolicy: {
              contentSecurityPolicy:
                "default-src 'self'; connect-src 'self' https://*.amazonaws.com",
              override: true,
            },
            strictTransportSecurity: {
              accessControlMaxAge: cdk.Duration.days(365),
              includeSubdomains: true,
              preload: true,
              override: true,
            },
            xssProtection: {
              protection: true,
              modeBlock: true,
              override: true,
            },
            frameOptions: {
              frameOption:
                cloudfront.HeadersFrameOption.DENY,
              override: true,
            },
            contentTypeOptions: { override: true },
            referrerPolicy: {
              referrerPolicy:
                cloudfront.HeadersReferrerPolicy.NO_REFERRER,
              override: true,
            },
          },
        }
      );

    /**
     * =========================================================
     * CLOUDFRONT DISTRIBUTION
     * =========================================================
     */
    const distribution = new cloudfront.Distribution(
      this,
      'FrontendDistribution',
      {
        defaultRootObject: 'index.html',
        defaultBehavior: {
          origin: new origins.S3Origin(siteBucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          responseHeadersPolicy: securityHeadersPolicy,
        },
      }
    );

    this.distributionDomainName =
      distribution.distributionDomainName;
  }
}
