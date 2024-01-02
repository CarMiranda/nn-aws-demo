#!/bin/bash

MODEL_NAME=mmocr-model

# Create model
aws sagemaker create-model \
  --no-cli-pager \
  --profile poc \
  --model-name ${MODEL_NAME} \
  --execution-role-arn "arn:aws:iam::AWS_ACCOUNT_ID:role/SagemakerFullAccessService" \
  --primary-container '{"Image": "763104351884.dkr.ecr.AWS_REGION.amazonaws.com/pytorch-inference:2.0-cpu-py310", "Mode": "SingleModel", "ModelDataUrl": "s3://sagemaker-inference-endpoint-b83fc6c3/ocr-models.tar.gz"}' 

