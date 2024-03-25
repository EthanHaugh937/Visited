from typing import Dict, List
import uuid
from app import client

db = client.get_database_client("visitedUserTravel")
container = db.get_container_client("userTravel")


def getUserVisitedRecord(userId: str) -> List[Dict[str, any]]:
    if item := container.query_items(
        f"SELECT * FROM userTravel t WHERE t.userId='{userId}'",
        enable_cross_partition_query=True,
    ):

        return list(item)

    return []


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


def upsertVisitedRecord(userId: str, arrival: str, departure: str, location: str):
    userRecord = getUserVisitedRecord(userId)

    dataToUpsert = dict(
        arrival= arrival,
        departure= departure,
        location= location,
    )

    userRecord[0]["visited"].append(dataToUpsert)

    return container.upsert_item(body=userRecord[0])
