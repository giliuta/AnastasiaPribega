#!/usr/bin/env python3
"""
PRIBEGA Beauty Studio - Backend API Testing
Tests all API endpoints for the luxury beauty website
"""

import requests
import sys
import json
from datetime import datetime

class PRIBEGAAPITester:
    def __init__(self, base_url="https://arch-beauty-lab.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []

    def log_result(self, test_name, passed, response_data=None, error=None):
        """Log test result"""
        self.tests_run += 1
        if passed:
            self.tests_passed += 1
        
        result = {
            "test": test_name,
            "passed": passed,
            "response": response_data,
            "error": str(error) if error else None,
            "timestamp": datetime.now().isoformat()
        }
        self.results.append(result)
        
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{status} - {test_name}")
        if error:
            print(f"   Error: {error}")
        if response_data and passed:
            print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.base_url}/", timeout=10)
            expected_message = "PRIBEGA API"
            
            if response.status_code == 200:
                data = response.json()
                if data.get("message") == expected_message:
                    self.log_result("API Root", True, data)
                    return True
                else:
                    self.log_result("API Root", False, data, f"Expected message '{expected_message}', got: {data}")
                    return False
            else:
                self.log_result("API Root", False, None, f"Status code {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("API Root", False, None, e)
            return False

    def test_contact_submission(self):
        """Test contact form submission"""
        test_data = {
            "name": "Test User",
            "email": "test@example.com", 
            "phone": "+357 12345678",
            "message": "Test message from automated testing",
            "language": "en"
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/contact",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                # Verify response contains our submitted data
                if (data.get("name") == test_data["name"] and 
                    data.get("email") == test_data["email"] and
                    data.get("id")):  # Should have generated ID
                    self.log_result("Contact Submission", True, data)
                    return data.get("id")  # Return ID for potential cleanup
                else:
                    self.log_result("Contact Submission", False, data, "Response data doesn't match submitted data")
                    return False
            else:
                self.log_result("Contact Submission", False, None, f"Status code {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("Contact Submission", False, None, e)
            return False

    def test_quiz_submission(self):
        """Test quiz submission with different scenarios"""
        test_cases = [
            {
                "name": "Natural Look Quiz",
                "data": {
                    "face_shape": "oval",
                    "brow_density": "medium", 
                    "desired_effect": "natural",
                    "experience": "basic"
                }
            },
            {
                "name": "Dramatic Look Quiz", 
                "data": {
                    "face_shape": "square",
                    "brow_density": "sparse",
                    "desired_effect": "dramatic", 
                    "experience": "none"
                }
            }
        ]
        
        all_passed = True
        
        for test_case in test_cases:
            try:
                response = requests.post(
                    f"{self.base_url}/quiz",
                    json=test_case["data"],
                    headers={"Content-Type": "application/json"},
                    timeout=15
                )
                
                if response.status_code == 200:
                    data = response.json()
                    # Verify response contains quiz data and recommendation
                    if (data.get("face_shape") == test_case["data"]["face_shape"] and 
                        data.get("recommendation") and
                        data.get("id")):  # Should have generated ID and recommendation
                        self.log_result(f"Quiz - {test_case['name']}", True, data)
                    else:
                        self.log_result(f"Quiz - {test_case['name']}", False, data, "Missing required response fields")
                        all_passed = False
                else:
                    self.log_result(f"Quiz - {test_case['name']}", False, None, f"Status code {response.status_code}")
                    all_passed = False
                    
            except Exception as e:
                self.log_result(f"Quiz - {test_case['name']}", False, None, e)
                all_passed = False
                
        return all_passed

    def test_get_contacts(self):
        """Test retrieving contacts (admin endpoint)"""
        try:
            response = requests.get(f"{self.base_url}/contacts", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):  # Should return a list
                    self.log_result("Get Contacts", True, f"Retrieved {len(data)} contacts")
                    return True
                else:
                    self.log_result("Get Contacts", False, data, "Expected list response")
                    return False
            else:
                self.log_result("Get Contacts", False, None, f"Status code {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("Get Contacts", False, None, e)
            return False

    def test_get_quiz_results(self):
        """Test retrieving quiz results (admin endpoint)"""
        try:
            response = requests.get(f"{self.base_url}/quiz-results", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):  # Should return a list
                    self.log_result("Get Quiz Results", True, f"Retrieved {len(data)} quiz results")
                    return True
                else:
                    self.log_result("Get Quiz Results", False, data, "Expected list response")
                    return False
            else:
                self.log_result("Get Quiz Results", False, None, f"Status code {response.status_code}")
                return False
                
        except Exception as e:
            self.log_result("Get Quiz Results", False, None, e)
            return False

    def run_all_tests(self):
        """Run complete test suite"""
        print("🔬 Starting PRIBEGA API Testing Suite...")
        print(f"📡 Testing endpoint: {self.base_url}")
        print("-" * 60)
        
        # Test API connectivity first
        if not self.test_api_root():
            print("❌ API root test failed - cannot continue with other tests")
            return False
        
        # Test core functionality
        self.test_contact_submission()
        self.test_quiz_submission()
        
        # Test admin endpoints
        self.test_get_contacts()
        self.test_get_quiz_results()
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 TEST SUMMARY")
        print(f"✅ Passed: {self.tests_passed}/{self.tests_run}")
        print(f"❌ Failed: {self.tests_run - self.tests_passed}/{self.tests_run}")
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All backend tests passed!")
            return True
        else:
            print("⚠️  Some backend tests failed. Check details above.")
            return False

def main():
    """Main test execution"""
    tester = PRIBEGAAPITester()
    
    try:
        success = tester.run_all_tests()
        
        # Save detailed results to file
        with open("/app/test_reports/backend_test_results.json", "w") as f:
            json.dump({
                "summary": {
                    "total_tests": tester.tests_run,
                    "passed": tester.tests_passed,
                    "failed": tester.tests_run - tester.tests_passed,
                    "success_rate": (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0,
                    "timestamp": datetime.now().isoformat()
                },
                "results": tester.results
            }, f, indent=2)
        
        return 0 if success else 1
        
    except Exception as e:
        print(f"💥 Critical error during testing: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())