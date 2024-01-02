#!/bin/bash

ENDPOINT_CONFIG_NAME=ocr-inference-endpoint-config
ENDPOINT_NAME=ocr-inference-endpoint

# Create and deploy endpoint
aws sagemaker create-endpoint \
  --profile poc \
  --no-cli-pager \
  --endpoint-name ${ENDPOINT_NAME} \
  --endpoint-config-name ${ENDPOINT_CONFIG_NAME}

# Delete endpoint
echo "To delete this endpoint, run:"
echo "aws sagemaker delete-endpoint --endpoint-name ${ENDPOINT_NAME}"
