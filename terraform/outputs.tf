output "api_endpoint" {
  description = "The API Gateway endpoint for the audit API"
  value       = aws_api_gateway_stage.dev_stage.invoke_url
}

output "frontend_bucket_name" {
  description = "S3 bucket for frontend"
  value       = aws_s3_bucket.frontend.id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.frontend.domain_name
}
