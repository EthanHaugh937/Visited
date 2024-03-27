from ast import Dict
from flask import jsonify, make_response
from app import app


from decorators.decorators import authenticated
from queries.location_queries import (
    insertNewRecordForUser,
    getUserVisitedRecord,
    upsertVisitedRecord,
    validateVisitedEntryExists,
)


@app.route(
    "/location/<string:countryCode>/<string:arrival>/<string:departure>",
    methods=["POST"],
)
@authenticated
def add_location(authentication: Dict, countryCode: str, arrival: str, departure: str):
    if not countryCode:
        return make_response(jsonify({"message": "Country Code not provided"}), 404)

    if not arrival or not departure:
        return make_response(jsonify({"message": "Visited Date not provided"}), 404)
    
    userId = authentication.get("userId")

    if len(getUserVisitedRecord(userId)) == 0:
        creation_result = insertNewRecordForUser(
            userId,
            arrival,
            departure,
            countryCode,
        )

        return make_response(jsonify(creation_result), 200)

    if validateVisitedEntryExists(
        userId,
        arrival,
        departure,
        countryCode,
    ):
        return make_response(jsonify({"message": "Record already exists"}), 400)

    return upsertVisitedRecord(userId, arrival, departure, countryCode)
