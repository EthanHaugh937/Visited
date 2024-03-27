from typing import Dict
from flask import jsonify, make_response
from app import app, client
import boto3

from decorators.decorators import authenticated
from queries.account_queries import deleteUserCosmosEntry
from azure.cosmos.exceptions import CosmosResourceNotFoundError

conn = boto3.client("cognito-idp")

@app.route("/account", methods=['DELETE'])
@authenticated
def delete_account(authentication: Dict[str, str]):
    try:
        deleteUserCosmosEntry(authentication.get("userId"))
    except (CosmosResourceNotFoundError):
        return make_response(jsonify({"message": "Resource does not exist"}), 400)

    response = conn.delete_user(AccessToken=authentication.get("token"))

    return make_response(jsonify({"message": response }), 200)
