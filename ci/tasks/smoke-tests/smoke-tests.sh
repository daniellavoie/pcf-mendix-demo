#!/bin/sh

echo "Running smoke tests"

curl --fail "$URL/rest/healthservice/v1/health" -k

CURL_STATUS=$?

echo "Exit status $CURL_STATUS"

if [ $CURL_STATUS -eq 0 ]
then
  echo "Successfully executed smoke tests"
  exit 0
else
  echo "Error during smoke tests." >&2
  exit 1
fi