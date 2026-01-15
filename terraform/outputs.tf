output "api_endpoint" {
  value = aws_api_gateway_deployment.deployment.invoke_url
}

output "lambda_arn" {
  value = aws_lambda_function.audit_api.arn
}

output "lambda_name" {
  value = aws_lambda_function.audit_api.function_name
}

output "caller_arn" {
  value = data.aws_caller_identity.current.arn
}

output "region" {
  value = var.aws_region
}
