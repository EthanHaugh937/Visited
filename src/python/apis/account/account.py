from typing import Dict
from flask import jsonify, make_response
from app import app
import boto3

from decorators.decorators import authenticated
from queries.account_queries import deleteUserCosmosEntry
from azure.cosmos.exceptions import CosmosResourceNotFoundError
from exceptions.account_exceptions import RecordDoesNotExist

conn = boto3.client("cognito-idp")

@app.route("/account", methods=['DELETE'])
@authenticated
def delete_account(authentication: Dict[str, str]):
    try:
        deleteUserCosmosEntry(authentication.get("userId"))
    except (CosmosResourceNotFoundError, RecordDoesNotExist):
        pass

    response = conn.delete_user(AccessToken=authentication.get("token"))

    return make_response(jsonify({"message": response }), 200)
