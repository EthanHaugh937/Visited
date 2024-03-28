from typing import Dict, List
from app import app, client
from exceptions.account_exceptions import RecordDoesNotExist

from azure.cosmos.container import ContainerProxy

db = client.get_database_client("visitedUserTravel")

def getUserRecord(userId: str, container: ContainerProxy) -> Dict[str, any]:
    item = list(container.query_items(
        f"SELECT * FROM {container.id} t WHERE t.userId='{userId}'",
        enable_cross_partition_query=True,
    ))

    if len(item) == 0:
        raise RecordDoesNotExist(userId)

    return item[0]


def deleteUserCosmosEntry(userId: str):
    container = db.get_container_client("userTravel")

    try:
        record = getUserRecord(userId, container)
    except RecordDoesNotExist as e:
        return e

    try:
        container.delete_item(record.get("id"), record.get("userId"))
    except Exception:
        return Exception


    container = db.get_container_client("userWishTravel")
    wishRecord = getUserRecord(userId, container)

    try: 
        container.delete_item(wishRecord.get("id"), wishRecord.get("userId"))
    except Exception:
        return Exception
    
    return True

