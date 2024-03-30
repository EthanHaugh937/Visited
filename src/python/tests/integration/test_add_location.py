def test_add_visited_location(client_app, user):
    response = client_app.post(
        "/location/IE-RN/20Z3Z2024/25Z3Z2024",
        headers={
            "Authorization": f'Bearer {user.get("AuthenticationResult").get("AccessToken")}'
        },
    )

    assert response.status_code == 200
    assert len(response.json.get("visited")) == 1
    assert response.json.get("visited") == [{'arrival': '20Z3Z2024', 'departure': '25Z3Z2024', 'location': 'IE-RN'}]

    response = client_app.get(
        "/location",
        headers={
            "Authorization": f'Bearer {user.get("AuthenticationResult").get("AccessToken")}'
        },
    )

    assert response.json == [{'arrival': '20Z3Z2024', 'departure': '25Z3Z2024', 'location': 'IE-RN'}]


def test_add_wish_location(client_app, user):
    response = client_app.post(
        "/wishlocation/IE-RN",
        headers={
            "Authorization": f'Bearer {user.get("AuthenticationResult").get("AccessToken")}'
        },
    )

    assert response.status_code == 200
    assert len(response.json.get("visited")) == 1
    assert response.json.get("visited") == [{'location': 'IE-RN'}]

    response = client_app.get(
        "/wishlocation",
        headers={
            "Authorization": f'Bearer {user.get("AuthenticationResult").get("AccessToken")}'
        },
    )

    assert response.status_code == 200
    assert response.json == {'locations': [{'location': 'IE-RN'}], 'wishItemsFulfilled': 1}

