from functools import wraps
import json
from typing import Dict
from urllib.request import urlopen
from flask import jsonify, request
from jose import JWTError, jwt


class AuthError(Exception):
    def __init__(self, error: Dict[str, str], status_code: int):
        super().__init__()
        self.error = error
        self.status_code = status_code


def authenticated(func):
    @wraps(func)
    def authenticated(*args, **kwargs):
        if (authToken := request.headers.get("Authorization", None)) is None:
            return jsonify({"message": "Please provide an access token"}), 401

        try:
            token = authToken.split()[1]
        except IndexError:
            return (
                jsonify(
                    {
                        "message": "Provide a valid access token in the form of 'Bearer TOKEN'"
                    }
                ),
                401,
            )

        jsonurl = urlopen("https://cognito-idp.us-east-1.amazonaws.com/us-east-1_5jDVTIUE5/.well-known/jwks.json")
        jwks = json.loads(jsonurl.read())

        try:
            unverified_header = jwt.get_unverified_header(token)
        except JWTError:
            return jsonify({"message": "Access Token is invalid!"}), 401

        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"],
                }
        if rsa_key:
            try:
                payload = jwt.decode(
                    token,
                    key=rsa_key,
                    algorithms=["RS256"],
                    issuer="https://cognito-idp.us-east-1.amazonaws.com/us-east-1_5jDVTIUE5",
                    options={
                        "verify_signature": True,
                        "exp": True,
                        "verify_aud": False,
                    },
                )
            except jwt.JWTError:
                return (
                    jsonify(
                        {"message": "Access Token Signature could not be Verified"}
                    ),
                    401,
                )
            except jwt.ExpiredSignatureError:
                return jsonify({"message": "Access Token expired"}), 401

            return func(payload["sub"], *args, **kwargs)
        raise AuthError(
            {"message": "Invalid Header: Could not find proper key"},
            401,
        )

    return authenticated
