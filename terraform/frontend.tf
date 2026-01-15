# Frontend S3 Bucket
resource "aws_s3_bucket" "frontend" {
  bucket = "aws-cloud-governance-frontend-${data.aws_caller_identity.current.account_id}"

  # Free Tier friendly, no ACLs
  force_destroy = true
}

# Block public access (required for CloudFront)
resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Upload frontend files to S3
resource "aws_s3_bucket_object" "index_html" {
  bucket       = aws_s3_bucket.frontend.id
  key          = "index.html"
  source       = "${path.module}/../frontend/public/index.html"
  content_type = "text/html"
}

resource "aws_s3_bucket_object" "app_js" {
  bucket       = aws_s3_bucket.frontend.id
  key          = "app.js"
  source       = "${path.module}/../frontend/src/app.js"
  content_type = "application/javascript"
}

resource "aws_s3_bucket_object" "api_js" {
  bucket       = aws_s3_bucket.frontend.id
  key          = "api.js"
  source       = "${path.module}/../frontend/src/api.js"
  content_type = "application/javascript"
}

resource "aws_s3_bucket_object" "style_css" {
  bucket       = aws_s3_bucket.frontend.id
  key          = "style.css"
  source       = "${path.module}/../frontend/src/style.css"
  content_type = "text/css"
}
