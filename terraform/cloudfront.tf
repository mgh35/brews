resource "aws_cloudfront_distribution" "frontend" {
  enabled = true
  default_root_object = "index.html"

  origin {
    domain_name = aws_s3_bucket.frontend.bucket_domain_name
    origin_id   = var.frontend_bucket

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.frontend.cloudfront_access_identity_path
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  custom_error_response {
    error_code    = 403
    response_code = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code    = 404
    response_code = 200
    response_page_path = "/index.html"
  }

#   # Route53 requires Alias/CNAME to be setup
#   aliases = [var.frontend_bucket]

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = var.frontend_bucket

    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = var.cache_default_ttl
    max_ttl                = var.cache_max_ttl
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

resource "aws_cloudfront_origin_access_identity" "frontend" {
  comment = "Origin Access Identity for S3"
}
