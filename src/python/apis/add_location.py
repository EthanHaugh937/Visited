from app import app, client


from decorators.decorators import authenticated


@app.route("/test/<string:countryCode>/<string:visitedDate>", methods=["POST"])
@authenticated
def add_location(userId: str, countryCode: str, visitedDate: str):
    return {"Hello": userId}
