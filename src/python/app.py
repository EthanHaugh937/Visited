from flask import Flask
from flask_cors import CORS
from waitress import serve
from azure.cosmos import CosmosClient
import os
from dotenv import load_dotenv

load_dotenv()

settings = {
    "host": os.environ.get("ACCOUNT_HOST", "https://visited.documents.azure.com:443/"),
    "master_key": os.environ.get("COSMOS_ACCOUNT_KEY"),
}

# Initialise Cosmos Client
client = CosmosClient(
    settings["host"],
    {"masterKey": settings["master_key"]},
    user_agent="CosmosDBPythonQuickstart",
    user_agent_overwrite=True,
)

app = Flask(__name__)
cors = CORS(app)

if __name__ == "__main__":
    serve(app, host="0.0.0.0", port=5000)

from apis.add_location.add_location import add_visited_location, add_wish_location
from apis.retrieve_location.retrieve_location import get_user_visited_locations, get_user_wish_locations
from apis.account.account import delete_account
from apis.delete_location.delete_location import delete_visited_location
