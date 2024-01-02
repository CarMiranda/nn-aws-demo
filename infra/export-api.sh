#!/bin/bash
API_ID=h3bqr12bwl 
STAGE_NAME=prod
OUTPUT=api.json

aws apigateway \
  --profile poc \
  get-export \
  --parameters extensions='apigateway' \
  --rest-api-id ${API_ID}\
  --stage-name ${STAGE_NAME} \
  --export-type swagger \
  $OUTPUT
