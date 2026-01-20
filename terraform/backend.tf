terraform {
  backend "s3" {
    bucket         = "aws-cloud-governance-tfstate-659587495811"
    key            = "state/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "aws-cloud-governance-tf-locks"
    encrypt        = true
  }
}
