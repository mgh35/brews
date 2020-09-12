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

# 2020-08-15

Finding it difficult to find a standard run configuration for VS Code. Getting all sorts
of setups from different people. This works for me:
```json
    {
        "type": "node",
        "request": "launch",
        "name": "Jest Tests",
        "runtimeExecutable": "${workspaceRoot}/brews/node_modules/.bin/react-scripts",
        "args": [
            "test",
            "--runInBand"
        ],
        "cwd": "${workspaceFolder}/brews",
        "env": {
            "CI": "true"
        }
    }
```
Particularly:
- Need to run `react-scripts`. Doesn't seem to pick up the config in `package.json`?
- Need to set `cwd` since I have the frontend code in a subfolder.
- Need to set `CI` = `true` to avoid tests starting in watch mode.

# 2020-09-06

I want to incorporate Redux, external to whether it's appropriate for the needs of this
particular project (notably, my job uses Redux so I want to learn more about it). At the
same time, I want to take the opportunity to restart the front-end code from scratch
given there's nothing substantive there yet here and I have a better sense how things
should look.

As to whether it's worthwhile having Redux, I've come across different points of view:
1) Redux is a confusing extra framework that's unneeded.
2) Redux is a useful tool as the app grows and managing state in React become
cumbersome.
3) Redux is to data what React is to the DOM, and they belong together as part of a
functional app.

The Redux docs seem to argue along the lines of (2), but I found the most convincing
arguments in (3). (I recall one particularly articulate interview that I now can't seem
to find.) The idea being that React is a framework to allow for a stateless and event-
driven view. Redux does the same for state. So if you want to go event-driven, you
really want the two together. And this is regardless of the size of the app.

```sh
npx create-react-app frontend --typescript
cd frontend
npm install --save redux react-redux @types/redux @types/react-redux
```

## 2020-09-12

And first thing after getting React & Redux set up, the question "Now how do I make my
API calls?" hits another wall. 

Without extra frameworks, the option would be more
callbacks under the connected components. This seems to break the modularity sought in
the first place. And a quick Google suggests that the duo React + Redux is actually
really a trio React + Redux + API Middleware.

As I currently understand it, I think the end-to-end data flow is supposed to look like:
```text
-----------------------------------------------
                       |
          API          |       ---DOM <---
                       |      |           |
------------------------------|-----------|----
                       |      |           V
         Redux         |      |      -> STATE
                       |      |    /       ^
------------------------------|---/--------|---
                       |      v  /         |
 Redux API Middleware  |     ACTION <--> ACTION
                       |     ^ ^ ^
-----------------------------|-|-|-------------
                       |     v v v
          API          |    ENDPOINTS
                       |
-----------------------------------------------
```

The key point of the API Middleware is as a place where the sequenced flow talking to
external endpoints can happen, and still have access to the Store's dispatch to
be able to reinject results to Redux. (This as compared with the connected components
being the only place with a connection to the Store.)

An additional point is that the separation of concerns for APIs might be different to
that for components. For example, there might be a global logged-in user. API queries
will need the users credentials. But components making use of state queries from the API
need not otherwise be connected with the user state.

The key choices available on the Redux API middleware side:
- redux-thunk: Callback-style flow control.
- redux-sagas: Async-style flow control.
- redux-observable: Reactive programming-style flow control. (Uses RxJS.)

Very keen to learn more about RxJS, but something for the future. Will stick with
redux-sagas here just to avoid yet another framework to learn.
