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
    validationFields = [
        "countryCode",
        "provinceCode",
        "arrival",
        "departure",
        "country",
        "province",
    ]
    userInformation = dict()

    for field in validationFields:
        if (data := request.json.get(field)) is None:
            return make_response(
                jsonify({"message": f"Parameter: {field} not provided"}), 400
            )
        userInformation.update({field: data})

    userId = authentication.get("userId")

    try:
        if validateVisitedEntryExists(
            userId,
            userInformation["arrival"],
            userInformation["departure"],
            f"{userInformation['countryCode']}-{userInformation['provinceCode']}",
        ):
            return make_response(jsonify({"message": "Record already exists"}), 400)
    except RecordDoesNotExist:
        response = insertNewVisitedRecordForUser(
            userId,
            userInformation["arrival"],
            userInformation["departure"],
            f"{userInformation['countryCode']}-{userInformation['provinceCode']}",
            userInformation["country"],
            userInformation["province"],
        )
        return make_response(response, 200)

    dataToUpsert = dict(
        id=str(uuid.uuid4()),
        arrival=userInformation["arrival"],
        departure=userInformation["departure"],
        location=f"{userInformation['countryCode']}-{userInformation['provinceCode']}",
        country=userInformation["country"],
        province=userInformation["province"],
    )

    response = upsertVisitedRecord(userId, dataToUpsert)

    return make_response(response, 200)


@app.route(
    "/api/v1.0/wishlocation",
    methods=["POST"],
)
@authenticated
def add_wish_location(authentication: Dict):
    validationFields = [
        "countryCode",
        "country",
        "provinceCode",
        "province",
    ]
    userInformation = dict()

    for field in validationFields:
        if (data := request.json.get(field)) is None:
            return make_response(
                jsonify({"message": f"Parameter: {field} not provided"}), 400
            )
        userInformation.update({field: data})

    userId = authentication.get("userId")

    # Check does document exist for user, if not create one
    try:
        if validateWishEntryExists(
            userId,
            f"{userInformation['countryCode']}-{userInformation['provinceCode']}",
        ):
            return make_response(jsonify({"message": "Record already exists"}), 400)
    except RecordDoesNotExist:
        response = insertNewWishRecordForUser(
            userId,
            f"{userInformation['countryCode']}-{userInformation['provinceCode']}",
            country=userInformation["country"],
            province=userInformation["province"],
        )
        return make_response(response, 200)

    dataToUpsert = dict(
        id=str(uuid.uuid4()),
        location=f"{userInformation['countryCode']}-{userInformation['provinceCode']}",
        country=userInformation["country"],
        province=userInformation["province"],
    )

    response = upsertWishRecord(userId, dataToUpsert)

    return make_response(response, 200)
