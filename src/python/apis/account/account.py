from ast import Dict
from flask import jsonify, make_response
from app import app
import boto3

from decorators.decorators import authenticated

conn = boto3.client("cognito-idp")

@app.route("/account", methods=['DELETE'])
@authenticated
def delete_account(authentication: Dict):
    response = conn.delete_user(AccessToken=authentication.get("token"))
    return make_response(jsonify({"message": response }))
