import pytest


@pytest.mark.order1
def test_add_visited_location(client_app, user):
    add_response = client_app.post(
        "/api/v1.0/location",
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


@pytest.mark.order2
def test_add_duplicate_visited_location(client_app, user):
    add_response = client_app.post(
        "/api/v1.0/location",
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

    assert add_response.status_code == 400
    assert add_response.json.get("message") == "Record already exists"


@pytest.mark.order3
def test_add_wish_location(client_app, user):
    response = client_app.post(
        "/api/v1.0/wishlocation",
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


@pytest.mark.order4
def test_add_duplicate_wish_location(client_app, user):
    add_response = client_app.post(
        "/api/v1.0/wishlocation",
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

    assert add_response.status_code == 400
    assert add_response.json.get("message") == "Record already exists"


@pytest.mark.order5
def test_retrieve_delete_wish_record(client_app, user):

    retrieve_response = client_app.get(
        "api/v1.0/wishlocation",
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
        f"/api/v1.0/wishlocation/{retrieve_response.json.get('locations')[0].get('id')}",
        headers={
            "Authorization": f'Bearer {user.get("AuthenticationResult").get("AccessToken")}'
        },
    )

    assert delete_response.status_code == 200
    assert delete_response.json.get("locations") == []


@pytest.mark.order6
def test_retrieve_delete_visited_record(client_app, user):

    retrieve_response = client_app.get(
        "api/v1.0/location",
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
        f"/api/v1.0/location/{retrieve_response.json[0].get('id')}",
        headers={
            "Authorization": f'Bearer {user.get("AuthenticationResult").get("AccessToken")}'
        },
    )

    assert delete_response.status_code == 200
    assert delete_response.json.get("locations") == []
    
@pytest.mark.order7
def test_nonexistent_delete_visited_record(client_app, user):
    delete_response = client_app.delete(
        f"/api/v1.0/location/test-id-123",
        headers={
            "Authorization": f'Bearer {user.get("AuthenticationResult").get("AccessToken")}'
        },
    )

    assert delete_response.status_code == 404
    assert delete_response.json.get("message") == "The requested record to delete cannot be found"
    

@pytest.mark.order8
def test_nonexistent_delete_wish_record(client_app, user):
    delete_response = client_app.delete(
        f"/api/v1.0/wishlocation/test-id-123",
        headers={
            "Authorization": f'Bearer {user.get("AuthenticationResult").get("AccessToken")}'
        },
    )

    assert delete_response.status_code == 404
    assert delete_response.json.get("message") == "The requested record to delete cannot be found"
