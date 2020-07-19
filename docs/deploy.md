# Deploy

## AWS Setup

Brews is set up to run on AWS. 

First thing is to set up an appropriate environment. I am currently following:

* Through the AWS Console, create a new account in which this will be run.
* Through the AWS Console, create an IAM under this account with API access only and
    the appropriate permissions.
* Through the AWS Console, create an S3 bucket `brews-terraform-state` (to act as the
    Terraform backend). Set this to have public access, but with the policy below. Turn
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
* In the local terminal, configured perms through `aws configure`.

## Build AWS Infrastructure

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

## Deploy the frontend

First, make sure to update the `.env` file (which includes the references to AWS infra
needed by the app):

```bash
./update-env.sh
```

Then build and deploy with:

```bash
./deploy.sh
```

# Run the app

Create a user with:

```bash
./create-user.sh
```

and follow the prompts. (Note: It's set up that all users need to be created manually
like this.) Cognito will email the temporary password.

Then open the app in the browser

```bash
./tf-out.sh | jq .cloudfront_domain.value -r
```
