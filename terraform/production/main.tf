provider "aws" {
    region = var.region
}

terraform {
  backend "s3" {
    bucket = "brews-terraform-state"
    key    = "production.tfstate"
    region = "ca-central-1"
  }
}

module "brews_table" {
    source = "../modules/brews-table"
}

module "cognito" {
    source = "../modules/cognito"

    app = var.app
    env = var.env
    grant_access_to_dynamodb = true
    dynamodb_table_arn = module.brews_table.arn
}

module "frontend" {
    source = "../modules/frontend"

    app = var.app
    env = var.env
}
