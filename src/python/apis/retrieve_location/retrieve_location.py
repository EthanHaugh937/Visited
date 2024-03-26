from app import app, client

from decorators.decorators import authenticated
from queries.location_queries import getUserLocations


@app.route("/location", methods=["GET"])
@authenticated
def get_user_locations(userId: str):
    return getUserLocations(userId)
