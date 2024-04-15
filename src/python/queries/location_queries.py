from typing import Dict, List
import uuid
from app import client
from queries.account_queries import getUserRecord
from exceptions.account_exceptions import RecordDoesNotExist

from azure.cosmos.container import ContainerProxy

db = client.get_database_client("visitedUserTravel")


def validateVisitedEntryExists(
    userId: str, arrival: str, departure: str, locationCode: str
) -> bool:
    container = db.get_container_client("userTravel")

    try:
        visitedLocations = getUserRecord(userId, container).get("locations")
    except RecordDoesNotExist as e:
        raise e

    if visitedLocations == None or visitedLocations == []:
        return False

    recordToSearchFor = {
        "arrival": arrival,
        "departure": departure,
        "location": locationCode,
    }

    for record in visitedLocations:
        if recordToSearchFor.items() <= record.items():
            return True

    return False


def validateWishEntryExists(userId: str, locationCode: str) -> bool:
    container = db.get_container_client("userWishTravel")

    try:
        wishLocations = getUserRecord(userId, container)
    except RecordDoesNotExist as e:
        raise e

    if wishLocations == None or wishLocations == []:
        return False

    recordToSearchFor = {
        "location": locationCode,
    }

    for record in wishLocations.get("locations"):
        if recordToSearchFor.items() <= record.items():
            return True

    return False


def insertNewVisitedRecordForUser(
    userId: str,
    arrival: str,
    departure: str,
    locationCode: str,
    country: str,
    province: str,
) -> Dict[str, str]:
    container = db.get_container_client("userTravel")

    insertInfo = {
        "id": str(uuid.uuid4()),
        "userId": userId,
        "locations": [
            {
                "id": str(uuid.uuid4()),
                "arrival": arrival,
                "departure": departure,
                "location": locationCode,
                "country": country,
                "province": province,
            }
        ],
    }

    return container.create_item(insertInfo)


def insertNewWishRecordForUser(
    userId: str, locationCode: str, country: str, province: str
) -> Dict[str, str]:
    container = db.get_container_client("userWishTravel")

    insertInfo = {
        "id": str(uuid.uuid4()),
        "userId": userId,
        "locations": [
            {
                "id": str(uuid.uuid4()),
                "location": locationCode,
                "country": country,
                "province": province,
            }
        ],
    }

    return container.create_item(insertInfo)


def upsertVisitedRecord(userId: str, dataToUpsert: Dict[str, str]) -> Dict[str, any]:
    container = db.get_container_client("userTravel")
    try:
        userRecord = getUserRecord(userId, container)
    except RecordDoesNotExist as e:
        raise e

    userRecord.get("locations").append(dataToUpsert)

    return container.upsert_item(body=userRecord)


def upsertWishRecord(userId: str, dataToUpsert: Dict[str, str]) -> Dict[str, any]:
    container = db.get_container_client("userWishTravel")

    try:
        userRecord = getUserRecord(userId, container)
    except RecordDoesNotExist as e:
        raise e

    userRecord.get("locations").append(dataToUpsert)

    return container.upsert_item(body=userRecord)


def getUserVisitedLocations(userId: str) -> List[Dict[str, str]]:
    container = db.get_container_client("userTravel")
    userRecord = getUserRecord(userId, container)

    return userRecord.get("locations")


def getUserWishLocations(userId: str) -> List[Dict[str, str]]:
    container = db.get_container_client("userWishTravel")

    try:
        userRecord = getUserRecord(userId, container)
    except RecordDoesNotExist as e:
        raise e

    if userRecord is not None:
        return userRecord.get("locations")

    return []


def deleteUserLocation(userId: str, recordId: str, container: ContainerProxy):
    try:
        userRecord = getUserRecord(userId, container)
    except RecordDoesNotExist as e:
        raise e
    
    lengthBefore = len(userRecord["locations"])

    userRecord["locations"] = [
        record for record in userRecord["locations"] if record.get("id") != recordId
    ]

    # If locations array has not changed length, nothing has been deleted
    if (len(userRecord["locations"]) == lengthBefore):
        raise RecordDoesNotExist(recordId)

    return container.upsert_item(body=userRecord)
