from sagemaker import image_uris
from sagemaker.model import Model
from datetime import datetime
import boto3

sagemaker_role= "arn:aws:iam::AWS_ACCOUNT_ID:role/SagemakerFullAccessService"
aws_region='AWS_REGION'
instance_type='ml.m5.xlarge'

def retrieve_image(role: str, region: str, instance_type: str):
    framework='pytorch'
    version = '2.0'
    container = image_uris.retrieve(
        region=region,
        framework=framework,
        version=version,
        image_scope="inference",
        instance_type=instance_type,
    )
    
    return container

def create_model(container: str, role: str):
    s3_bucket = 's3://sagemaker-inference-endpoint-b83fc6c3'
    model_s3_key = 'ocr-models.tar.gz'
    model_url = f'{s3_bucket}/{model_s3_key}'
    model = Model(
        image_uri=container,
        model_data=model_url,
        role=role,
        source_dir="code"
    )
    return model

def create_endpoint(model: Model, instance_type: str, name: str | None = None):
    endpoint_name = f"sagemaker-ocr-inference-endpoint-{datetime.utcnow():%Y-%m-%d-%H%M}"
    if name is not None:
        endpoint_name = name

    print("EndpointName =", endpoint_name)
    initial_instance_count=1
    model.deploy(
        initial_instance_count=initial_instance_count,
        instance_type=instance_type,
        endpoint_name=endpoint_name,
        wait=False,
    )

    return endpoint_name

def delete_endpoint(name: str):
    sagemaker_client = boto3.client('sagemaker', region_name=aws_region)
    sagemaker_client.delete_endpoint(EndpointName=name)


