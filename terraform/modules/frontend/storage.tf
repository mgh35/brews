resource aws_s3_bucket "frontend" {
  bucket        = local.storage_bucket
  acl           = "private"
  force_destroy = true
  policy = <<EOF
{
  "Id": "bucket_policy_site",
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "bucket_policy_site_root",
      "Action": ["s3:ListBucket"],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::${local.storage_bucket}",
      "Principal": {"AWS":"${aws_cloudfront_origin_access_identity.frontend.iam_arn}"}
    },
    {
      "Sid": "bucket_policy_site_all",
      "Action": ["s3:GetObject"],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::${local.storage_bucket}/*",
      "Principal": {"AWS":"${aws_cloudfront_origin_access_identity.frontend.iam_arn}"}
    }
  ]
}
EOF
  website {
    index_document = "index.html"
    error_document = "404.html"
  }
}
