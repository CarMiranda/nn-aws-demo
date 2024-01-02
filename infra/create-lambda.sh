#!/bin/bash

CODE_BUCKET=ocr-inference-endpoint
CODE_KEY=lambda.py
ENDPOINT_NAME=ocr-inference-endpoint
EXECUTION_ROLE_ARN=arn:aws:iam::AWS_ACCOUNT_ID:role/LambdaInvokeAnySageMakerEndpoint
EXECUTION_ROLE_NAME=LambdaInvokeSageMakerEndpoint

# Upload code
zip lambda.zip lambda.py
aws s3 cp \
  lambda.py \
  s3://${CODE_BUCKET}/${CODE_KEY}


# Create policy allowing to invoke the sagemaker endpoint and retrieve its arn 
INVOKE_POLICY_ARN=`aws iam create-policy \
  --policy-name InvokeSageMakerEndpoint \
  --policy-document file://invoke_sagemaker_endpoint.json \
  --output text \
  --query Policy.Arn`

# Create execution role
EXECUTION_ROLE_ARN=`aws iam create-role \
  --role-name ${EXECUTION_ROLE_NAME} \
  --assume-role-policy-document file://role.json \
  --output text \
  --query Role.Arn`

# Attach the previously created policy
aws iam attach-role-policy \
  --role-name ${EXECUTION_ROLE_NAME} \
  --policy-name ${INVOKE_POLICY_ARN}

# Attach basic lambda execution policy
LAMBDA_EXECUTION_POLICY_ARN=$(aws iam list-policies --query 'Policies[?PolicyName==`AWSLambdaBasicExecutionRole`].PolicyArn' --output text)
aws iam attach-role-policy \
  --role-name ${EXECUTION_ROLE_NAME} \
  --policy-name ${LAMBDA_EXECUTION_POLICY_ARN}

# Create function and publish
CODE='{"S3Bucket": "'"${CODE_BUCKET}"'", "S3Key": "'"${CODE_KEY}"'"}'
ENVIRONMENT_VARIABLES='{"Variables": {"ENDPOINT_NAME": "'"${ENDPOINT_NAME}"'"}}'
LAMBDA_ARN=`aws lambda create-function \
  --function-name "ocr-inference-endpoint" \
  --runtime "python3.11" \
  --role ${EXECUTION_ROLE_ARN} \
  --code $CODE \
  --environment ${ENVIRONMENT_VARIABLES} \
  --handler "lambda.lambda_handler" \
  --publish \
  --query "FunctionArn" --output text`

# Create API and link it to the previously created lambda
aws apigateway \
  import-rest-api \
  --parameters endpointConfigurationTypes=REGIONAL \
  --fail-on-warnings \
  --cli-binary-format raw-in-base64-out \
  --body "file://api.json"

