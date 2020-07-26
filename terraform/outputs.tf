output "region" {
  value = var.region
}

output "frontend_bucket" {
  value = var.frontend_bucket
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.frontend.id
}

output "cloudfront_domain" {
  value = aws_cloudfront_distribution.frontend.domain_name
}

output "user_pool_id" {
  value = aws_cognito_user_pool.users.id
}

output "user_pool_client_id" {
  value = aws_cognito_user_pool_client.users.id
}

output "identity_pool_id" {
  value = aws_cognito_identity_pool.users.id
}