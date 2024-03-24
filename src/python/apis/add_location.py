from app import app, client

@app.route('/test')
def test():
    return {'Hello': 'World'}