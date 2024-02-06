from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)


@app.route('/home')
def hello():
    return {'test': 'Hello, World!'}

if __name__ == "__main__":
    app.run(debug=True)