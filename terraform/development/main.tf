provider "aws" {
    region = var.region
}

terraform {
  backend "s3" {
    bucket = "brews-terraform-state"
    key    = "development.tfstate"
    region = "ca-central-1"
  }
}

module "cognito" {
    source = "../modules/cognito"

    app = var.app
    env = var.env
    grant_access_to_dynamodb = false
}
