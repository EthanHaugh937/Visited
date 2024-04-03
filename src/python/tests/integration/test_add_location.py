def test_add_visited_location(client_app, user):
    response = client_app.post(
        "/location/IE-RN/20Z3Z2024/25Z3Z2024",
        headers={
            "Authorization": f'Bearer {user.get("AuthenticationResult").get("AccessToken")}'
        },
    )

    assert response.status_code == 200
    assert len(response.json.get("visited")) == 1
    assert (
        response.json.get("visited")[0].items()
        >= {
            "arrival": "20Z3Z2024",
            "departure": "25Z3Z2024",
            "location": "IE-RN",
        }.items()
    )

    response = client_app.get(
        "/location",
        headers={
            "Authorization": f'Bearer {user.get("AuthenticationResult").get("AccessToken")}'
        },
    )

    assert (
        response.json[0].items()
        >= {
            "arrival": "20Z3Z2024",
            "departure": "25Z3Z2024",
            "location": "IE-RN",
        }.items()
    )


def test_add_wish_location(client_app, user):
    response = client_app.post(
        "/wishlocation/IE-RN",
        headers={
            "Authorization": f'Bearer {user.get("AuthenticationResult").get("AccessToken")}'
        },
    )

    assert response.status_code == 200
    assert len(response.json.get("visited")) == 1
    assert response.json.get("visited")[0].items() >= {"location": "IE-RN"}.items()

    response = client_app.get(
        "/wishlocation",
        headers={
            "Authorization": f'Bearer {user.get("AuthenticationResult").get("AccessToken")}'
        },
    )

    assert response.status_code == 200
    assert response.json.get("locations")[0].items() >= {"location": "IE-RN"}.items()
    assert response.json.get("wishItemsFulfilled") == 1
