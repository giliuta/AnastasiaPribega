"""
PRIBEGA API Backend Tests
Tests for contact form submission and quiz endpoints
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://arch-beauty-lab.preview.emergentagent.com')

class TestHealthCheck:
    """API Health and Root Endpoint Tests"""
    
    def test_api_root_returns_200(self):
        """Verify API root endpoint is accessible"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert data["message"] == "PRIBEGA API"


class TestContactAPI:
    """Contact Form Submission Tests"""
    
    def test_contact_submission_success(self):
        """Test successful contact form submission"""
        unique_id = str(uuid.uuid4())[:8]
        payload = {
            "name": f"TEST_Contact_{unique_id}",
            "email": f"test_{unique_id}@example.com",
            "phone": "+35797463797",
            "message": "Test booking request for brow correction",
            "language": "ru"
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        
        # Status assertion
        assert response.status_code == 200
        
        # Data assertions
        data = response.json()
        assert "id" in data
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["phone"] == payload["phone"]
        assert data["message"] == payload["message"]
        assert data["language"] == "ru"
        assert "created_at" in data
    
    def test_contact_submission_english(self):
        """Test contact form submission in English"""
        unique_id = str(uuid.uuid4())[:8]
        payload = {
            "name": f"TEST_English_{unique_id}",
            "email": f"english_{unique_id}@example.com",
            "phone": "+1234567890",
            "message": "I would like to book a brow lamination",
            "language": "en"
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        assert data["language"] == "en"
        assert data["message"] == payload["message"]
    
    def test_contact_submission_minimal_fields(self):
        """Test contact form with minimal required fields"""
        unique_id = str(uuid.uuid4())[:8]
        payload = {
            "name": f"TEST_Minimal_{unique_id}",
            "email": f"minimal_{unique_id}@test.com",
            "message": "Test message"
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        assert data["phone"] == ""  # Default empty string
        assert data["language"] == "ru"  # Default language
    
    def test_contact_submission_missing_required_fields(self):
        """Test that missing required fields return error"""
        payload = {
            "name": "Test User"
            # Missing email and message
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        
        # Should return 422 Unprocessable Entity
        assert response.status_code == 422
    
    def test_get_contacts_list(self):
        """Test retrieving list of contacts"""
        response = requests.get(f"{BASE_URL}/api/contacts")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


class TestQuizAPI:
    """Quiz Submission and Recommendation Tests"""
    
    def test_quiz_natural_effect_recommendation(self):
        """Test quiz with natural effect desired"""
        unique_id = str(uuid.uuid4())[:8]
        payload = {
            "face_shape": "oval",
            "brow_density": "medium",
            "desired_effect": "natural",
            "experience": "basic",
            "name": f"TEST_Quiz_{unique_id}",
            "email": f"quiz_{unique_id}@test.com"
        }
        response = requests.post(f"{BASE_URL}/api/quiz", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        
        # Validate structure
        assert "id" in data
        assert "recommendation" in data
        assert data["face_shape"] == "oval"
        assert data["brow_density"] == "medium"
        assert data["desired_effect"] == "natural"
        assert data["experience"] == "basic"
        assert "created_at" in data
        
        # Verify recommendation is provided
        assert len(data["recommendation"]) > 0
    
    def test_quiz_defined_effect_recommendation(self):
        """Test quiz with defined effect desired"""
        payload = {
            "face_shape": "round",
            "brow_density": "sparse",
            "desired_effect": "defined",
            "experience": "none"
        }
        response = requests.post(f"{BASE_URL}/api/quiz", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        assert data["desired_effect"] == "defined"
        assert "recommendation" in data
        assert len(data["recommendation"]) > 0
    
    def test_quiz_dramatic_effect_recommendation(self):
        """Test quiz with dramatic effect desired"""
        payload = {
            "face_shape": "heart",
            "brow_density": "thick",
            "desired_effect": "dramatic",
            "experience": "advanced"
        }
        response = requests.post(f"{BASE_URL}/api/quiz", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        assert data["desired_effect"] == "dramatic"
        assert "recommendation" in data
    
    def test_quiz_missing_required_fields(self):
        """Test quiz with missing required fields"""
        payload = {
            "face_shape": "oval"
            # Missing other required fields
        }
        response = requests.post(f"{BASE_URL}/api/quiz", json=payload)
        
        # Should return 422 Unprocessable Entity
        assert response.status_code == 422
    
    def test_get_quiz_results_list(self):
        """Test retrieving list of quiz results"""
        response = requests.get(f"{BASE_URL}/api/quiz-results")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


class TestAcademyContactSubmission:
    """Academy Application Form Tests"""
    
    def test_academy_application_submission(self):
        """Test academy application via contact endpoint with [ACADEMY] prefix"""
        unique_id = str(uuid.uuid4())[:8]
        payload = {
            "name": f"TEST_Academy_{unique_id}",
            "email": f"academy_{unique_id}@test.com",
            "phone": "+35700000000",
            "message": "[ACADEMY] I want to enroll in the brow training course",
            "language": "ru"
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        assert "[ACADEMY]" in data["message"]
        assert data["name"] == payload["name"]


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
