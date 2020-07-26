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

resource aws_cognito_identity_pool "users" {
    identity_pool_name = "${var.app} ${var.env} users IDP"
    allow_unauthenticated_identities = false

    cognito_identity_providers {
          client_id = aws_cognito_user_pool_client.users.id
          provider_name = aws_cognito_user_pool.users.endpoint
          server_side_token_check = false
    }
}

resource aws_iam_role "authenticated" {
  name = "authenticated"

  assume_role_policy = <<-EOF
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Federated": "cognito-identity.amazonaws.com"
        },
        "Action": "sts:AssumeRoleWithWebIdentity",
        "Condition": {
          "StringEquals": {
            "cognito-identity.amazonaws.com:aud": "${aws_cognito_identity_pool.users.id}"
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "authenticated"
          }
        }
      }
    ]
  }
  EOF
}

resource aws_iam_role_policy "dynamodb" {
  name = "dynamodb"
  role = aws_iam_role.authenticated.id

  policy = <<-EOF
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:Query"
        ],
        "Resource": [
          "${aws_dynamodb_table.brews.arn}"
        ],
        "Condition": {
            "ForAllValues:StringEquals": {
                "dynamodb:LeadingKeys": [
                    "$${cognito-identity.amazonaws.com:sub}"
                ]
            }
        }
      }
    ]
  }
  EOF
}

resource aws_cognito_identity_pool_roles_attachment "main" {
  identity_pool_id = aws_cognito_identity_pool.users.id
  roles = {
    "authenticated" = aws_iam_role.authenticated.arn
  }
}
