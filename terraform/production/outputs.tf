output "region" {
  value = var.region
}

output "frontend_bucket" {
  value = module.frontend.storage_bucket
}

output "cloudfront_distribution_id" {
  value = module.frontend.cloudfront_distribution_id
}

output "cloudfront_domain" {
  value = module.frontend.cloudfront_domain
}

output "user_pool_id" {
  value = module.cognito.user_pool_id
}

output "user_pool_client_id" {
  value = module.cognito.user_pool_client_id
}

output "identity_pool_id" {
  value = module.cognito.identity_pool_id
}
