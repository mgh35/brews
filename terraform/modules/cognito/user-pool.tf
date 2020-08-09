resource aws_cognito_user_pool "users" {
  name = "${var.app}-users-${var.env}"
  admin_create_user_config {
    allow_admin_create_user_only = true
  }
  password_policy {
    minimum_length = 6
    require_lowercase = false
    require_numbers = false
    require_symbols = false
    require_uppercase = false
    temporary_password_validity_days = 7
  }
  schema {
    name = "email"
    attribute_data_type = "String"
    mutable = true
    required = true
    developer_only_attribute = false
    string_attribute_constraints {
      min_length = "0"
      max_length = "2048"
    }
  }
}

resource aws_cognito_user_pool_domain "users" {
  domain = "${var.app}-users-${var.env}"
  user_pool_id = aws_cognito_user_pool.users.id
}

resource aws_cognito_user_pool_client "users" {
  name = "${aws_cognito_user_pool.users.name}-client"
  user_pool_id = aws_cognito_user_pool.users.id
}
