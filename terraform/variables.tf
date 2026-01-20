variable "project_name" {
  description = "The name of the project for naming resources"
  type        = string
  default     = "aws-cloud-governance"
}

variable "aws_region" {
  description = "AWS region to deploy resources in"
  type        = string
  default     = "us-east-1"
}
