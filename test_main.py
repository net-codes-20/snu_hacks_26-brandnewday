import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "HabiTribe AI Service is running!"}

def test_onboarding_archetype():
    response = client.post(
        "/onboarding/archetype",
        json={"answers": ["A", "B", "A", "C", "A"]}
    )
    assert response.status_code == 200
    data = response.json()
    assert "archetype" in data
    assert "quote" in data

def test_restore_analysis():
    response = client.post(
        "/ai/restore-analysis",
        json={"user_explanation": "I was too tired after a long day of work."}
    )
    assert response.status_code == 200
    data = response.json()
    assert "friction_type" in data
    assert "new_intention" in data
