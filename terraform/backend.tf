terraform {
  backend "s3" {
    bucket = "brews-terraform-state"
    key    = "terraform.tfstate"
    region = "ca-central-1"
  }
}