#!/bin/bash

BODY="api.json"

aws apigateway \
  --profile poc \
  import-rest-api \
  --parameters endpointConfigurationTypes=REGIONAL \
  --fail-on-warnings \
  --cli-binary-format raw-in-base64-out \
  --body "file://$BODY"
