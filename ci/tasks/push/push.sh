#!/bin/sh

set -x	

SRC=src

cleanOldApplications() {
  cf delete -f $APP_NAME
  cf delete-service -f $DB_NAME
}

loginAndTargetSpace(){
  cf api $CF_API --skip-ssl-validation && \
  cf auth $CF_USER $CF_PASSWORD
  
  cf create-space -o $CF_ORG $CF_SPACE
  cf target -o $CF_ORG -s $CF_SPACE

  # TODO - return error
}

pushApplication() {
  cf push --no-start -p $SRC/CF-Push-Demo/ -f $SRC/CF-Push-Demo/manifest-$ENVIRONMENT.yml $APP_NAME -n $APP_HOSTNAME -d $APP_DOMAIN

  cf create-service $DB_SERVICE_NAME $DB_SERVICE_PLAN $DB_NAME
  cf bind-service $APP_NAME $DB_NAME
  cf start $APP_NAME
  # TODO - return error
}

# TODO - Check for errors
loginAndTargetSpace

cleanOldApplications

# TODO - Check for errors
pushApplication