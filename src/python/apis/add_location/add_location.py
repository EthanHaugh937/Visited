import json
import uuid
from flask import jsonify, make_response
from app import app, client


from decorators.decorators import authenticated

db = client.get_database_client("visitedUserTravel")
container = db.get_container_client("userTravel")


@app.route("/test/<string:countryCode>/<string:visitedDate>", methods=["POST"])
@authenticated
def add_location(userId: str, countryCode: str, visitedDate: str):
    if not countryCode:
        return make_response(jsonify({"message": "Country Code not provided"}), 404)

    if not visitedDate:
        return make_response(jsonify({"message": "Visited Date not provided"}), 404)

    if len(list(container.query_items(
        f"SELECT * FROM userTravel t WHERE t.userId='{userId}' AND t.location='{countryCode}' AND t.date='{visitedDate}'",
        enable_cross_partition_query=True,
    ))) != 0:
        return make_response(jsonify({"message": "Record already exists for that data"}), 404)

    creation_result = container.create_item(
        dict(
            id=str(uuid.uuid4()), userId=userId, date=visitedDate, location=countryCode
        )
    )

    return make_response(jsonify(creation_result), 200)
