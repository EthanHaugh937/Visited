from typing import Dict

from flask import jsonify, make_response
from app import app, client

from decorators.decorators import authenticated
from queries.location_queries import getUserVisitedLocations, getUserWishLocations
from exceptions.account_exceptions import RecordDoesNotExist


@app.route("/api/v1.0/location", methods=["GET"])
@authenticated
def get_user_visited_locations(authentication: Dict[str, str]):
    try:
        response = getUserVisitedLocations(authentication.get("userId"))
    except RecordDoesNotExist:
        return make_response(jsonify({"message": "The requested resource does not exist!"}), 400)

    return response


@app.route("/api/v1.0/wishlocation", methods=["GET"])
@authenticated
def get_user_wish_locations(authentication: Dict[str, str]):
    try:
        visitedResponse = getUserVisitedLocations(authentication.get("userId"))
    except RecordDoesNotExist:
        return make_response(jsonify({"message": "The requested resource has no visited listed to compare to!"}), 400)
    try:
        wishResponse = getUserWishLocations(authentication.get("userId"))
    except RecordDoesNotExist:
        return make_response(jsonify({"message": "The requested resource does not exist!"}), 400)
    
    wishItemsFulfilled = 0
    
    for visitedItem in visitedResponse:
        for wishItem in wishResponse:
            if set(wishItem.values()) & set(visitedItem.values()):
                wishItemsFulfilled += 1

    dataToReturn = dict(locations=wishResponse, wishItemsFulfilled=wishItemsFulfilled)
    return make_response(dataToReturn, 200)