from typing import Dict, List
import uuid
from app import client
from queries.account_queries import getUserVisitedRecord

db = client.get_database_client("visitedUserTravel")
container = db.get_container_client("userTravel")

def validateVisitedEntryExists(
    userId: str, arrival: str, departure: str, locationCode: str
) -> bool:
    visitedLocations = getUserVisitedRecord(userId)[0].get("visited")

    recordToSearchFor = {
        "arrival": arrival,
        "departure": departure,
        "location": locationCode,
    }

    if recordToSearchFor in visitedLocations:
        return True

    return False


def insertNewRecordForUser(
    userId: str, arrival: str, departure: str, locationCode: str
) -> Dict[str, str]:
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


def upsertVisitedRecord(
    userId: str, arrival: str, departure: str, location: str
) -> Dict[str, any]:
    userRecord = getUserVisitedRecord(userId)

    dataToUpsert = dict(
        arrival=arrival,
        departure=departure,
        location=location,
    )

    userRecord[0]["visited"].append(dataToUpsert)

    return container.upsert_item(body=userRecord[0])


def getUserLocations(userId: str) -> List[Dict[str, str]]:
    userRecord = getUserVisitedRecord(userId)

    return userRecord[0]["visited"]
