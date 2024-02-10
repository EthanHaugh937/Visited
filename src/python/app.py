from flask import Flask
from flask_cors import CORS
from waitress import serve

app = Flask(__name__)
cors = CORS(app)


@app.route('/home')
def hello():
    return {'test': 'Hello, World!'}

if __name__ == "__main__":
    serve(app, host="0.0.0.0", port=5000)