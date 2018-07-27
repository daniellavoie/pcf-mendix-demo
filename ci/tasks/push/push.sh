#!/bin/sh

set -x	

SRC=src

cleanOldApplications() {
  cf delete -f $APP_NAME
}

loginAndTargetSpace(){
  cf api $CF_API --skip-ssl-validation && \
  cf auth $CF_USER $CF_PASSWORD
  
  cf create-space -o $CF_ORG $CF_SPACE
  cf target -o $CF_ORG -s $CF_SPACE

  # TODO - return error
}

pushApplication() {
  cf push --no-start -p $SRC/CF-Push-Demo/ $APP_NAME -n $APP_HOSTNAME -d $APP_DOMAIN -b $BUILDPACK

  
  if [ ! -z "$MENDIX_ADMIN_PASSWORD" ]; then
    cf set-env $APP_NAME ADMIN_PASSWORD $MENDIX_ADMIN_PASSWORD
  fi
  
  cf unset-env $APP_NAME DATABASE_URL
  if [ ! -z "$MENDIX_DATABASE_URL" ]; then
    cf set-env $APP_NAME DATABASE_URL $MENDIX_DATABASE_URL
  fi


  if [ ! -z "$MENDIX_DB_NAME" ]; then
    cf bind-service $APP_NAME $MENDIX_DB_NAME
  fi

  cf start $APP_NAME

  if [ ! -z "$MENDIX_ADMIN_PASSWORD" ]; then
    cf unset-env $APP_NAME ADMIN_PASSWORD
  fi

  # TODO - return error
}

# TODO - Check for errors
loginAndTargetSpace

cleanOldApplications

# TODO - Check for errors
pushApplication