resource aws_cognito_identity_pool "users" {
  identity_pool_name               = "${var.app} ${var.env} users IDP"
  allow_unauthenticated_identities = false

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.users.id
    provider_name           = aws_cognito_user_pool.users.endpoint
    server_side_token_check = false
  }
}

resource aws_iam_role "authenticated" {
  name = "${var.app}-${var.env}-authenticated"

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
  count = var.grant_access_to_dynamodb ? 1 : 0

  name = "${var.app}-${var.env}-dynamodb"
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
          "dynamodb:Query",
          "dynamodb:DeleteItem"
        ],
        "Resource": [
          "${var.dynamodb_table_arn}"
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
