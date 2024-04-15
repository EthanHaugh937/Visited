import boto3
import os
from dotenv import load_dotenv
import pytest

load_dotenv()

auth_client = boto3.client("cognito-idp", region_name="us-east-1")


@pytest.mark.last
def test_delete_user_account(client_app, user):
    response = client_app.delete(
        "/api/v1.0/account",
        headers={
            "Authorization": f'Bearer {user.get("AuthenticationResult").get("AccessToken")}'
        },
    )

    assert response.status == "200 OK"
    assert response.status_code == 200

    # Expect admin_get_user to fail since user should be deleted
    try:
        auth_response = auth_client.admin_get_user(
            UserPoolId=os.getenv("COGNITO_USER_POOL_ID"),
            Username=os.getenv("COGNITO_EMAIL"),
        )
    except Exception as e:
        assert e.response.get("Error").get("Message") == "User does not exist."
        assert e.response.get("Error").get("Code") == "UserNotFoundException"

    # Check has access token been revoked
    retrieve_response = client_app.get(
        "/api/v1.0/location",
        headers={
            "Authorization": f'Bearer {user.get("AuthenticationResult").get("AccessToken")})'
        }
    )

    assert retrieve_response.status_code == 401
    assert retrieve_response.json.get("message") == "Access Token is invalid!"