from flask import Flask
from flask_cors import CORS
from waitress import serve
from azure.cosmos import CosmosClient
import os

settings = {
    'host': os.environ.get('ACCOUNT_HOST', 'https://visited.documents.azure.com:443/'),
    'master_key': os.environ.get('COSMOS_ACCOUNT_KEY'),
}

client = CosmosClient(settings['host'], {'masterKey': settings['master_key']}, user_agent="CosmosDBPythonQuickstart", user_agent_overwrite=True)

app = Flask(__name__)
cors = CORS(app)

if __name__ == "__main__":
    serve(app, host="0.0.0.0", port=5000)

from apis.add_location import add_location