variable "app" {
    description = "The app name"
    type = string
}

variable "env" {
    description = "The environment name"
    type = string
}

variable "cache_default_ttl" {
  description = "Cloudfront's cache default time to live."
  default = 3600
}

variable "cache_max_ttl" {
  description = "Cloudfront's cache maximun time to live."
  default = 86400
}

locals {
    storage_bucket = "${var.app}-frontend-storage-${var.env}"
}
