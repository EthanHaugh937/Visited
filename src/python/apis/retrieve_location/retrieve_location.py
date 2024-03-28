from typing import Dict

from flask import jsonify, make_response
from app import app, client

from decorators.decorators import authenticated
from queries.location_queries import getUserVisitedLocations, getUserWishLocations
from exceptions.account_exceptions import RecordDoesNotExist


@app.route("/location", methods=["GET"])
@authenticated
def get_user_visited_locations(authentication: Dict[str, str]):
    try:
        response = getUserVisitedLocations(authentication.get("userId"))
    except RecordDoesNotExist:
        return make_response(jsonify({"message": "The requested resource does not exist!"}), 400)

    return response


@app.route("/wishlocation", methods=["GET"])
@authenticated
def get_user_wish_locations(authentication: Dict[str, str]):
    try:
        response = getUserWishLocations(authentication.get("userId"))
    except RecordDoesNotExist:
        return make_response(jsonify({"message": "The requested resource does not exist!"}), 400)

    return response