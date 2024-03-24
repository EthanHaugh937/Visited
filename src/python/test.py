from azure.cosmos import CosmosClient
import os
import json

settings = {
    'host': os.environ.get('ACCOUNT_HOST', 'https://visited.documents.azure.com:443/'),
    'master_key': os.environ.get('COSMOS_ACCOUNT_KEY'),
}

client = CosmosClient(settings['host'], {'masterKey': settings['master_key']}, user_agent="CosmosDBPythonQuickstart", user_agent_overwrite=True)

DATABASE_NAME = 'visitedUserTravel'
database = client.get_database_client(DATABASE_NAME)
CONTAINER_NAME = 'userTravel'
container = database.get_container_client(CONTAINER_NAME)

for item in container.query_items(query="Select * FROM userTravel", enable_cross_partition_query=True):
    print(json.dumps(item, indent=True))