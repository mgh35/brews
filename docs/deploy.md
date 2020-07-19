# Deploy

## AWS Setup

Brews is set up to run on AWS. 

First thing is to set up an appropriate environment. Following what I can find of best
practice, I have:

* Created a new account in which this will be run.
* Created an IAM under this account with API access only and the appropriate
    permissions.
* Configured perms through `aws configure`

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
