from typing import Dict, List
import uuid
from app import client
from queries.account_queries import getUserRecord
from exceptions.account_exceptions import RecordDoesNotExist

db = client.get_database_client("visitedUserTravel")


def validateVisitedEntryExists(
    userId: str, arrival: str, departure: str, locationCode: str
) -> bool:
    container = db.get_container_client("userTravel")

    try:
        visitedLocations = getUserRecord(userId, container).get("visited")
    except RecordDoesNotExist as e:
        raise e

    recordToSearchFor = {
        "arrival": arrival,
        "departure": departure,
        "location": locationCode,
    }

    if recordToSearchFor in visitedLocations:
        return True

    return False


def validateWishEntryExists(userId: str, locationCode: str) -> bool:
    container = db.get_container_client("userWishTravel")

    wishLocations = getUserRecord(userId, container).get("visited")

    recordToSearchFor = {
        "location": locationCode,
    }

    if recordToSearchFor in wishLocations:
        return True

    return False


def insertNewVisitedRecordForUser(
    userId: str, arrival: str, departure: str, locationCode: str
) -> Dict[str, str]:
    container = db.get_container_client("userTravel")

    insertInfo = {
        "id": str(uuid.uuid4()),
        "userId": userId,
        "visited": [
            {
                "arrival": arrival,
                "departure": departure,
                "location": locationCode,
            }
        ],
    }

    return container.create_item(insertInfo)


def insertNewWishRecordForUser(userId: str, locationCode: str) -> Dict[str, str]:
    container = db.get_container_client("userWishTravel")

    insertInfo = {
        "id": str(uuid.uuid4()),
        "userId": userId,
        "visited": [{"location": locationCode}],
    }

    return container.create_item(insertInfo)


def upsertVisitedRecord(userId: str, dataToUpsert: Dict[str, str]) -> Dict[str, any]:
    container = db.get_container_client("userTravel")
    try:
        userRecord = getUserRecord(userId, container)
    except RecordDoesNotExist as e:
        raise e

    userRecord.get("visited").append(dataToUpsert)

    return container.upsert_item(body=userRecord)

def upsertWishRecord(userId: str, dataToUpsert: Dict[str, str]) -> Dict[str, any]:
    container = db.get_container_client("userWishTravel")
    
    try:
        userRecord = getUserRecord(userId, container)
    except RecordDoesNotExist as e:
        raise e

    userRecord.get("visited").append(dataToUpsert)

    return container.upsert_item(body=userRecord)


def getUserVisitedLocations(userId: str) -> List[Dict[str, str]]:
    container = db.get_container_client("userTravel")
    userRecord = getUserRecord(userId, container)

    return userRecord.get("visited")


def getUserWishLocations(userId: str) -> List[Dict[str, str]]:
    container = db.get_container_client("userWishTravel")

    try:
        userRecord = getUserRecord(userId, container)
    except RecordDoesNotExist as e:
        raise e

    if userRecord is not None: 
        return userRecord.get("visited")
    
    return []
