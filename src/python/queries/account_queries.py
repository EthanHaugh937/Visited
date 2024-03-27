from typing import Dict, List
from app import app, client

db = client.get_database_client("visitedUserTravel")
container = db.get_container_client("userTravel")

def getUserVisitedRecord(userId: str) -> List[Dict[str, any]]:
    if item := container.query_items(
        f"SELECT * FROM userTravel t WHERE t.userId='{userId}'",
        enable_cross_partition_query=True,
    ):

        return list(item)

    return []


def deleteUserCosmosEntry(userId: str):
    record = getUserVisitedRecord(userId)[0]

    return container.delete_item(record.get("id"), record.get("userId"))



