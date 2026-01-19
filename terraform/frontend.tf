# ------------------------------
# Frontend Deployment (Free Tier)
# ------------------------------

# Get current AWS account
data "aws_caller_identity" "current" {}

# 1️⃣ S3 Bucket for Frontend
resource "aws_s3_bucket" "frontend" {
  bucket        = "aws-cloud-governance-frontend-${data.aws_caller_identity.current.account_id}"
  force_destroy = true
}

# 2️⃣ Block public access initially
resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# 3️⃣ Upload Frontend Files
resource "aws_s3_object" "index_html" {
  bucket       = aws_s3_bucket.frontend.id
  key          = "index.html"
  source       = "${path.module}/../frontend/public/index.html"
  content_type = "text/html"
}

resource "aws_s3_object" "app_js" {
  bucket       = aws_s3_bucket.frontend.id
  key          = "app.js"
  source       = "${path.module}/../frontend/src/app.js"
  content_type = "application/javascript"
}

resource "aws_s3_object" "api_js" {
  bucket       = aws_s3_bucket.frontend.id
  key          = "api.js"
  source       = "${path.module}/../frontend/src/api.js"
  content_type = "application/javascript"
}

resource "aws_s3_object" "style_css" {
  bucket       = aws_s3_bucket.frontend.id
  key          = "style.css"
  source       = "${path.module}/../frontend/src/style.css"
  content_type = "text/css"
}

# 4️⃣ CloudFront Distribution (Free Tier friendly)
resource "aws_cloudfront_distribution" "frontend" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = "S3-Frontend"
  }

  default_cache_behavior {
    target_origin_id       = "S3-Frontend"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}
