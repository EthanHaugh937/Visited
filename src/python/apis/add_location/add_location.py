from ast import Dict
import uuid
from flask import jsonify, make_response, request
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
    "/api/v1.0/location",
    methods=["POST"],
)
@authenticated
def add_visited_location(authentication: Dict):
    if not (countryCode := request.json.get("countryCode")):
        return make_response(jsonify({"message": "Country Code not provided"}), 400)

    if not (provinceCode := request.json.get("provinceCode")):
        return make_response(jsonify({"message": "Province Code not provided"}), 400)

    if not (arrival := request.json.get("arrival")):
        return make_response(jsonify({"message": "Arrival date not provided"}), 400)

    if not (departure := request.json.get("departure")):
        return make_response(jsonify({"message": "Departure date not provided"}), 400)

    userId = authentication.get("userId")

    try:
        if validateVisitedEntryExists(
            userId,
            arrival,
            departure,
            f"{countryCode}-{provinceCode}",
        ):
            return make_response(jsonify({"message": "Record already exists"}), 400)
    except RecordDoesNotExist:
        response = insertNewVisitedRecordForUser(
            userId, arrival, departure, f"{countryCode}-{provinceCode}"
        )
        return make_response(response, 200)

    dataToUpsert = dict(
        id=str(uuid.uuid4()),
        arrival=arrival,
        departure=departure,
        location=f"{countryCode}-{provinceCode}",
        country=request.json.get("country"),
        province=request.json.get("province"),
    )

    response = upsertVisitedRecord(userId, dataToUpsert)

    return make_response(response, 200)


@app.route(
    "/api/v1.0/wishlocation",
    methods=["POST"],
)
@authenticated
def add_wish_location(authentication: Dict):
    if not (countryCode := request.json.get("countryCode")):
        return make_response(jsonify({"message": "Country Code not provided"}), 404)

    if not (provinceCode := request.json.get("provinceCode")):
        return make_response(jsonify({"message": "Province Code not provided"}), 404)

    userId = authentication.get("userId")

    try:
        if validateWishEntryExists(
            userId,
            f"{countryCode}-{provinceCode}",
        ):
            return make_response(jsonify({"message": "Record already exists"}), 400)
    except RecordDoesNotExist:
        response = insertNewWishRecordForUser(
            userId,
            f"{countryCode}-{provinceCode}",
            country=request.json.get("country"),
            province=request.json.get("province"),
        )
        return make_response(response, 200)

    dataToUpsert = dict(
        id=str(uuid.uuid4()),
        location=f"{countryCode}-{provinceCode}",
        country=request.json.get("country"),
        province=request.json.get("province"),
    )

    response = upsertWishRecord(userId, dataToUpsert)

    return make_response(response, 200)
