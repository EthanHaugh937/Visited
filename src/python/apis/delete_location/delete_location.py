from typing import Dict

from flask import jsonify, make_response
from app import app, client
from decorators.decorators import authenticated
from exceptions.account_exceptions import RecordDoesNotExist
from queries.account_queries import getUserRecord
from queries.location_queries import (
    deleteUserLocation,
)

db = client.get_database_client("visitedUserTravel")

@app.route("/api/v1.0/location/<string:recordId>", methods=["DELETE"])
@authenticated
def delete_visited_location(authentication: Dict[str, str], recordId: str):
    userId = authentication.get("userId")

    container = db.get_container_client("userTravel")

    try:
        response = deleteUserLocation(userId, recordId, container)
    except RecordDoesNotExist as e:
        return make_response(
            jsonify({"message": "The requested record to delete cannot be found"}), 404)
        

    return make_response(response, 200)


@app.route("/api/v1.0/wishlocation/<string:recordId>", methods=["DELETE"])
@authenticated
def delete_wish_location(authentication: Dict[str, str], recordId: str):
    userId = authentication.get("userId")

    container = db.get_container_client("userWishTravel")

    try:
        response = deleteUserLocation(userId, recordId, container)
    except RecordDoesNotExist as e:
        return make_response(
            jsonify({"message": "The requested record to delete cannot be found"}), 404
        )

    return make_response(response, 200)
