# Concourse Pipeline for deploying a Mendix application to Pivotal Cloud Foundry

## Start Concourse from binary

```
concourse quickstart \
  --basic-auth-username myuser \
  --basic-auth-password mypass \
  --external-url http://localhost:8080 \
  --worker-work-dir /opt/concourse/worker
```

## Pipelines

The project serves an example of a continuous delivery pipeline. With this setup, a package is always ready to be deployed or redepoyed to production.

## Features

* Pull Request status verification
* Automatic deploy to staging environment after merge
* Promotion from staging environment to production
* Blue Green deployment

## Preparing your credential file

```
cf-api: CF-API-ENDPOINT
cf-user: CF-USER
cf-password: CF-PASSWORD

github-uri: https://ACCESS-TOKEN@github.com/ORG-NAME/REPO-NAME
github-access-token: ACCESS-TOKEN
```

## Pull Request Pipeline

![Pull Request](doc/images/pull-request.png)

### Deploying with fly
```
fly -t target set-pipeline -p pull-request -c ci /pull-request-pipeline.yml -l PATH-TO-CREDENTIAL-YML
```

## Release Train Pipeline

![Release Train Pipeline](doc/images/release-pipeline.png)

### Deploying with fly

```
fly -t target set-pipeline -p release-train -c ci /release-train-pipeline.yml -l PATH-TO-CREDENTIAL-YML
```

