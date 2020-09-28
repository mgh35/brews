resource aws_dynamodb_table "brews" {
  name         = "Brews"
  billing_mode = "PAY_PER_REQUEST"

  hash_key  = "client_id"
  range_key = "timestamp"

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }
}
