resource "aws_dynamodb_table" "audit_logs" {
  name         = "${var.project_name}-audit-logs"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}
