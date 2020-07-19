# Deploy

## AWS Setup

Brews is set up to run on AWS. 

First thing is to set up an appropriate environment. Following what I can find of best
practice, My current setup was:

* Through the AWS Console, I created a new account in which this will be run.
* Through the AWS Console, I created an IAM under this account with API access only and
    the appropriate permissions.
* Through the AWS Console, I created an S3 bucket `brews-terraform-state` (to act as the
    Terraform backend). I set this to public access with the policy below. And I turned
    on versioning.
```
{
    "Version": "2012-10-17",
    "Id": "bucket_policy_site",
    "Statement": [
        {
            "Sid": "bucket_policy_site_root",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::284595203895:user/brews-admin"
            },
            "Action": "s3:ListBucket",
            "Resource": "arn:aws:s3:::brews-terraform-state"
        },
        {
            "Sid": "bucket_policy_site_all",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::284595203895:user/brews-admin"
            },
            "Action": ["s3:GetObject", "s3:PutObject"],
            "Resource": "arn:aws:s3:::brews-terraform-state/*"
        }
    ]
}
```
* In my local terminal, I configured perms through `aws configure`.

# Build AWS Infrastructure

All of the AWS infrastructure can be setup with Terraform. Once the AWS perms are
configured as above, run:

```bash
cd terraform
terraform apply
```

Note: Until the S3 bucket's name has propagated through the AWS DNS (which apparently
can take a couple hours), CloudFront will send a TemporaryRedirect pointint to the
regional bucket URL. (And because this isn't being exposed in Brew's setup, that will
throw an AccessDenied.) But once the DNS entry has propagated, it should work as
expected.

