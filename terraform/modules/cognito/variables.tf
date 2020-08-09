variable "app" {
    description = "The app name"
    type = string
}

variable "env" {
    description = "The environment name"
    type = string
}

variable "grant_access_to_dynamodb" {
    description = "Should cognito grant access to a DynamoDB table?"
    type = bool
    default = false
}

variable "dynamodb_table_arn" {
    description = "The ARN of a DynamoDB table to which Cognito will grant access"
    type = string
    default = ""
}
