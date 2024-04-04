def test_add_visited_location(client_app, user):
    add_response = client_app.post(
        "/location",
        headers={
            "Authorization": f'Bearer {user.get("AuthenticationResult").get("AccessToken")}'
        },
        json={
            "countryCode": "IE",
            "country": "Ireland",
            "provinceCode": "RN",
            "province": "Roscommon",
            "arrival": "20Z3Z2024",
            "departure": "25Z3Z2024",
        },
    )

    assert add_response.status_code == 200
    assert len(add_response.json.get("locations")) == 1
    assert (
        add_response.json.get("locations")[0].items()
        >= {
            "arrival": "20Z3Z2024",
            "departure": "25Z3Z2024",
            "location": "IE-RN",
            "country": "Ireland",
            "province": "Roscommon",
        }.items()
    )


def test_add_wish_location(client_app, user):
    response = client_app.post(
        "/wishlocation",
        headers={
            "Authorization": f'Bearer {user.get("AuthenticationResult").get("AccessToken")}'
        },
        json={
            "countryCode": "IE",
            "country": "Ireland",
            "provinceCode": "RN",
            "province": "Roscommon",
        },
    )

    assert response.status_code == 200
    assert len(response.json.get("locations")) == 1
    assert (
        response.json.get("locations")[0].items()
        >= {"location": "IE-RN", "country": "Ireland", "province": "Roscommon"}.items()
    )


def test_retrieve_delete_visited_record(client_app, user):

    retrieve_response = client_app.get(
        "/location",
        headers={
            "Authorization": f'Bearer {user.get("AuthenticationResult").get("AccessToken")}'
        },
    )

    assert retrieve_response.status_code == 200
    assert (
        retrieve_response.json[0].items()
        >= {
            "arrival": "20Z3Z2024",
            "departure": "25Z3Z2024",
            "location": "IE-RN",
            "country": "Ireland",
            "province": "Roscommon",
        }.items()
    )

    delete_response = client_app.delete(
        f"/location/{retrieve_response.json[0].get('id')}",
        headers={
            "Authorization": f'Bearer {user.get("AuthenticationResult").get("AccessToken")}'
        },
    )

    assert delete_response.status_code == 200
    assert delete_response.json.get("locations") == []


def test_retrieve_delete_wish_record(client_app, user):

    retrieve_response = client_app.get(
        "/wishlocation",
        headers={
            "Authorization": f'Bearer {user.get("AuthenticationResult").get("AccessToken")}'
        },
    )

    assert retrieve_response.status_code == 200
    assert (
        retrieve_response.json.get("locations")[0].items()
        >= {"location": "IE-RN", "country": "Ireland", "province": "Roscommon"}.items()
    )
    assert retrieve_response.json.get("wishItemsFulfilled") == 1

    delete_response = client_app.delete(
        f"/wishlocation/{retrieve_response.json.get('locations')[0].get('id')}",
        headers={
            "Authorization": f'Bearer {user.get("AuthenticationResult").get("AccessToken")}'
        },
    )

    assert delete_response.status_code == 200
    assert delete_response.json.get("locations") == []
