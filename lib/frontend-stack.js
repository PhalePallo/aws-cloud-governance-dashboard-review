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
exports.FrontendStack = void 0;
var cdk = require("aws-cdk-lib");
var s3 = require("aws-cdk-lib/aws-s3");
var cloudfront = require("aws-cdk-lib/aws-cloudfront");
var origins = require("aws-cdk-lib/aws-cloudfront-origins");
var FrontendStack = /** @class */ (function (_super) {
    __extends(FrontendStack, _super);
    function FrontendStack(scope, id, props) {
        var _this = _super.call(this, scope, id, props) || this;
        /**
         * =========================================================
         * S3 BUCKET (STATIC WEBSITE ORIGIN)
         * =========================================================
         * - Private bucket
         * - No public access
         * - CloudFront is the only reader
         */
        var siteBucket = new s3.Bucket(_this, 'FrontendBucket', {
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
        var oac = new cloudfront.CfnOriginAccessControl(_this, 'FrontendOAC', {
            originAccessControlConfig: {
                name: 'FrontendOAC',
                originAccessControlOriginType: 's3',
                signingBehavior: 'always',
                signingProtocol: 'sigv4',
            },
        });
        /**
         * =========================================================
         * SECURITY HEADERS POLICY
         * =========================================================
         */
        var securityHeadersPolicy = new cloudfront.ResponseHeadersPolicy(_this, 'SecurityHeadersPolicy', {
            securityHeadersBehavior: {
                contentSecurityPolicy: {
                    contentSecurityPolicy: "default-src 'self'; connect-src 'self' https://*.amazonaws.com",
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
                    frameOption: cloudfront.HeadersFrameOption.DENY,
                    override: true,
                },
                contentTypeOptions: { override: true },
                referrerPolicy: {
                    referrerPolicy: cloudfront.HeadersReferrerPolicy.NO_REFERRER,
                    override: true,
                },
            },
        });
        /**
         * =========================================================
         * CLOUDFRONT DISTRIBUTION
         * =========================================================
         */
        var distribution = new cloudfront.Distribution(_this, 'FrontendDistribution', {
            defaultRootObject: 'index.html',
            defaultBehavior: {
                origin: new origins.S3Origin(siteBucket),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                responseHeadersPolicy: securityHeadersPolicy,
            },
        });
        _this.distributionDomainName =
            distribution.distributionDomainName;
        return _this;
    }
    return FrontendStack;
}(cdk.Stack));
exports.FrontendStack = FrontendStack;
