output "user_pool_id" {
  value = aws_cognito_user_pool.users.id
}

output "user_pool_client_id" {
  value = aws_cognito_user_pool_client.users.id
}

output "identity_pool_id" {
  value = aws_cognito_identity_pool.users.id
}
