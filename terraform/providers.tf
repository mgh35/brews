provider "aws" {
    region = "ca-central-1"
}

# resource "random_id" "frontend_bucket_name" {
#   byte_length = 4
#   prefix = "${var.app_name}-frontend-bucket-"
#   keepers = {
#     # Locks the ID until we change the version
#     version = "1"
#   }
# }
