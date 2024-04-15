from app import app
from dotenv import load_dotenv
import boto3
import pytest
import os

load_dotenv()


@pytest.fixture
def client_app():
    app.testing = True
    with app.test_client() as client:
        yield client


# Create Cognito user to access protected Flask endpoints
@pytest.fixture
def user():
    auth_client = boto3.client("cognito-idp", region_name="us-east-1")

    # Attempt to make mock user
    try:
        auth_client.admin_create_user(
            UserPoolId=os.getenv("COGNITO_USER_POOL_ID"),
            Username=os.getenv("COGNITO_EMAIL"),
            TemporaryPassword=os.getenv("COGNITO_PASSWORD"),
            MessageAction='SUPPRESS'
        )

        auth_client.admin_set_user_password(
            UserPoolId=os.getenv("COGNITO_USER_POOL_ID"),
            Username=os.getenv("COGNITO_EMAIL"),
            Password=os.getenv("COGNITO_PASSWORD"),
            Permanent=True,
        )
    except Exception as e:
        if e.response.get("Error").get("Code") == "UsernameExistsException":
            pass

    # Yield user information
    response = auth_client.initiate_auth(
        ClientId=os.getenv("COGNITO_CLIENT_ID"),
        AuthFlow="USER_PASSWORD_AUTH",
        AuthParameters={
            "USERNAME": os.getenv("COGNITO_EMAIL"),
            "PASSWORD": os.getenv("COGNITO_PASSWORD"),
        },
    )
    yield response
