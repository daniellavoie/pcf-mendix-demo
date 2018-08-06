#!/bin/sh

set -x	

SRC=src

cleanOldApplications() {
  cf delete -f $APP_NAME-old
}

loginAndTargetSpace(){
  cf api $CF_API --skip-ssl-validation && \
  cf auth $CF_USER $CF_PASSWORD && \
  cf target -o $CF_ORG -s $CF_SPACE

  # TODO - return error
}

pushApplication() {
  cf push --no-start -p $SRC/CF-Push-Demo/ $APP_NAME -n $APP_HOSTNAME -d $APP_DOMAIN -b mendix_buildpack

  cf bind-service $APP_NAME $DB_NAME
  cf start $APP_NAME
  # TODO - return error
}

renameApplications() {
  cf rename $APP_NAME $APP_NAME-old
}

# TODO - Check for errors
loginAndTargetSpace

cleanOldApplications

renameApplications

# TODO - Check for errors
pushApplication

cleanOldApplications