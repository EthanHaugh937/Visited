from ast import Dict
import uuid
from flask import jsonify, make_response
from app import app


from exceptions.account_exceptions import RecordDoesNotExist
from decorators.decorators import authenticated
from queries.location_queries import (
    insertNewVisitedRecordForUser,
    insertNewWishRecordForUser,
    upsertWishRecord,
    upsertVisitedRecord,
    validateVisitedEntryExists,
    validateWishEntryExists,
)


@app.route(
    "/location/<string:countryCode>/<string:arrival>/<string:departure>",
    methods=["POST"],
)
@authenticated
def add_visited_location(
    authentication: Dict, countryCode: str, arrival: str, departure: str
):
    if not countryCode:
        return make_response(jsonify({"message": "Country Code not provided"}), 404)

    if not arrival or not departure:
        return make_response(jsonify({"message": "Visited Date not provided"}), 404)

    userId = authentication.get("userId")

    try: 
        if validateVisitedEntryExists(
            userId,
            arrival,
            departure,
            countryCode,
        ):
            return make_response(jsonify({"message": "Record already exists"}), 400)
    except RecordDoesNotExist:
        response = insertNewVisitedRecordForUser(userId, arrival, departure, countryCode)
        return make_response(response, 200)

    dataToUpsert = dict(id=str(uuid.uuid4()), arrival=arrival, departure=departure, location=countryCode)

    response = upsertVisitedRecord(userId, dataToUpsert)

    return make_response(response, 200)


@app.route(
    "/wishlocation/<string:countryCode>",
    methods=["POST"],
)
@authenticated
def add_wish_location(authentication: Dict, countryCode: str):
    if not countryCode:
        return make_response(jsonify({"message": "Country Code not provided"}), 404)

    userId = authentication.get("userId")

    try: 
        if validateWishEntryExists(
            userId,
            countryCode,
        ):
            return make_response(jsonify({"message": "Record already exists"}), 400)
    except RecordDoesNotExist:
        response = insertNewWishRecordForUser(userId, countryCode)
        return make_response(response, 200)

    dataToUpsert = dict(id=str(uuid.uuid4()), location=countryCode)

    response = upsertWishRecord(userId, dataToUpsert)

    return make_response(response, 200)
