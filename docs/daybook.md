# 2020-07-18

AWS Amplify framework?
- Promises very quick setup of basic utilities (eg auth, DB, API to DB).
- Prefering to keep with Terraform (for now at least) to make sure it's repeatable.

# 2020-07-19

Terraform state shouldn't live on my local

Still internally debating Amplify vs Terraform 
- [This](https://medium.com/@mim3dot/aws-amplify-pros-and-cons-bf77a98da5db) seems to
    align with what I was thinking 
- Will persevere with current setup

# 2020-07-26

Internally debating the storage choice
- DynamoDB designed for scale seems to make evolution more difficult
- Cost-wise, at my scale of 1 DynamoDB is basically free vs a non-trivial amount for an
    RDBMS (even a managed instance)
- No reason I have to do DynamoDB as recommended for scale
    - Eg multiple tables will be just fine at my scale of 1
- Naive DynamoDB setup it will be for the moment

I'm now at the point I need a dev environment
- Looks like I can spin up a local DynamoDB in Docker
- React already easy to run in dev
- How do I manage dev config?

Starting to wonder the best way to manage state
- Questions:
    - What happens to local edit if no connection?
    - If two sessions, do they see each other's edits?
- Key Use Cases:
    - Record a new brew
    - Analytics on previous brews
- Design Considerations:
    - Consistency between two contemporaneous sessions not required
    - If connection lost, don't want to lose data entered
   
# 2020-07-28

Sorting out the split between environments is eating way too much time debating over
nothing:
- How to avoid leaking environment config into other environments?
- How to make sure environments are distinct?
- How will auth work?
- Local or cloud dynamodb?

Plan of attack to just get this done:
1) Abstract all config into a new config.js. Get config.js from .env.{ENV} files.
2) Get local dynamodb running and make sure it connects.
3) Refactor terraform into modules. Make instances for each env. Test will just use a
Cognito UserPool for the moment.

# 2020-08-03

Massive round-about trying to sort out local DynamoDB. Two things:
1) The credentials can be anything, but have to be present and each set of credentials
is like a separate sandbox. So if you, eg, create a table with one set of credentials
you will only be able to see it when using those same credentials.
2) It doesn't add the CORS header to errors. So on an error you will actually see a
CORS error and not the real error. (This even though CORS is fine on a successful call.)
