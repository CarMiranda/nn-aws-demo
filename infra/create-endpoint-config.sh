#!/bin/bash

ENDPOINT_CONFIG_NAME=ocr-inference-endpoint-config
MODEL_NAME=mmocr-model

# Create endpoint config using model name
PRODUCTION_VARIANTS="VariantName=prod0,ModelName=${MODEL_NAME},InitialInstanceCount=1,InstanceType=ml.m5.xlarge"
aws sagemaker create-endpoint-config \
  --no-cli-pager \
  --profile poc \
  --endpoint-config-name ${ENDPOINT_CONFIG_NAME} \
  --production-variants ${PRODUCTION_VARIANTS}

