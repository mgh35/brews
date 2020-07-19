output "frontend_bucket" {
    value = var.frontend_bucket
}

output "cloudfront_distribution_id"{
  value = aws_cloudfront_distribution.frontend.id
}

output "cloudfront_domain"{
  value = aws_cloudfront_distribution.frontend.domain_name
}
