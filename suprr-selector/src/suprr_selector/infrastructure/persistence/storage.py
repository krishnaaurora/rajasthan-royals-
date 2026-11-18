import os
import boto3
from botocore.client import Config
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).resolve().parent.parent.parent.parent.parent / ".env"
if env_path.exists():
    load_dotenv(env_path)

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_ENDPOINT_URL_S3 = os.getenv("AWS_ENDPOINT_URL_S3")
AWS_REGION = os.getenv("AWS_REGION", "ap-southeast-1")

def get_s3_client():
    if not (AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY and AWS_ENDPOINT_URL_S3):
        return None
    return boto3.client(
        "s3",
        endpoint_url=AWS_ENDPOINT_URL_S3,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION,
        config=Config(s3={"addressing_style": "path"}, signature_version="s3v4")
    )

def check_object_storage():
    """Verify Neon Object Storage connectivity and list buckets."""
    client = get_s3_client()
    if not client:
        return {"status": "error", "message": "Neon S3 storage credentials not configured"}
    
    try:
        response = client.list_buckets()
        buckets = [b["Name"] for b in response.get("Buckets", [])]
        return {
            "status": "connected",
            "endpoint": AWS_ENDPOINT_URL_S3,
            "region": AWS_REGION,
            "buckets": buckets
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
