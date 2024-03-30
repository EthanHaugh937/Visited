import boto3
import os
from dotenv import load_dotenv

load_dotenv()

auth_client = boto3.client("cognito-idp")


def test_delete_user_account(client_app, user):
    response = client_app.delete(
        "/account",
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