"""
Comprehensive API Endpoint Testing Script
Tests Authentication, Cart, and Orders endpoints
"""
import requests
import json
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8000/api"  # Change if your backend runs on different port
TEST_EMAIL = f"test_{datetime.now().strftime('%Y%m%d_%H%M%S')}@example.com"
TEST_PASSWORD = "TestPass123"

# Colors for output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_test(test_name):
    print(f"\n{Colors.BLUE}{'='*60}")
    print(f"TEST: {test_name}")
    print(f"{'='*60}{Colors.END}")

def print_success(message):
    print(f"{Colors.GREEN}✓ {message}{Colors.END}")

def print_error(message):
    print(f"{Colors.RED}✗ {message}{Colors.END}")

def print_info(message):
    print(f"{Colors.YELLOW}ℹ {message}{Colors.END}")

# Global variables to store test data
access_token = None
guest_session_id = None
cart_item_id = None

# ============================================================================
# AUTHENTICATION TESTS
# ============================================================================

def test_register():
    """Test user registration"""
    print_test("User Registration")

    url = f"{BASE_URL}/auth/register"
    data = {
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD,
        "first_name": "Test",
        "last_name": "User"
    }

    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")

        if response.status_code == 201:
            global access_token
            access_token = response.json().get("access_token")
            print_success(f"Registration successful! Token: {access_token[:20]}...")
            return True
        else:
            print_error(f"Registration failed: {response.json().get('detail')}")
            return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

def test_login_json():
    """Test login with JSON body"""
    print_test("Login with JSON")

    url = f"{BASE_URL}/auth/login/json"
    data = {
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD
    }

    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")

        if response.status_code == 200:
            global access_token
            access_token = response.json().get("access_token")
            print_success(f"Login successful! Token: {access_token[:20]}...")
            return True
        else:
            print_error(f"Login failed: {response.json().get('detail')}")
            return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

def test_get_current_user():
    """Test getting current user profile"""
    print_test("Get Current User Profile")

    url = f"{BASE_URL}/auth/me"
    headers = {"Authorization": f"Bearer {access_token}"}

    try:
        response = requests.get(url, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")

        if response.status_code == 200:
            print_success("Successfully retrieved user profile")
            return True
        else:
            print_error(f"Failed to get profile: {response.json().get('detail')}")
            return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

# ============================================================================
# CART TESTS
# ============================================================================

def test_add_to_cart():
    """Test adding item to cart"""
    print_test("Add Item to Cart")

    url = f"{BASE_URL}/cart/add"
    headers = {"Authorization": f"Bearer {access_token}"}
    data = {
        "articlenr": "10001",  # You may need to change this to a valid article number
        "quantity": 2
    }

    try:
        response = requests.post(url, json=data, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")

        if response.status_code == 200:
            global cart_item_id
            cart_data = response.json()
            if cart_data.get("items"):
                cart_item_id = cart_data["items"][0]["cart_item_id"]
            print_success(f"Item added to cart! Cart item ID: {cart_item_id}")
            return True
        else:
            print_error(f"Failed to add item: {response.json().get('detail')}")
            return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

def test_view_cart():
    """Test viewing cart contents"""
    print_test("View Cart Contents")

    url = f"{BASE_URL}/cart/"
    headers = {"Authorization": f"Bearer {access_token}"}

    try:
        response = requests.get(url, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")

        if response.status_code == 200:
            cart_data = response.json()
            print_success(f"Cart retrieved! Items: {cart_data['summary']['item_count']}, Total: €{cart_data['summary']['total']}")
            return True
        else:
            print_error(f"Failed to get cart: {response.json().get('detail')}")
            return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

def test_get_cart_count():
    """Test getting cart item count"""
    print_test("Get Cart Item Count")

    url = f"{BASE_URL}/cart/count"
    headers = {"Authorization": f"Bearer {access_token}"}

    try:
        response = requests.get(url, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")

        if response.status_code == 200:
            count_data = response.json()
            print_success(f"Cart count: {count_data['count']} items ({count_data.get('unique_items', 0)} unique)")
            return True
        else:
            print_error(f"Failed to get cart count: {response.json().get('detail')}")
            return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

def test_update_cart_item():
    """Test updating cart item quantity"""
    print_test("Update Cart Item Quantity")

    if not cart_item_id:
        print_error("No cart item ID available. Skipping test.")
        return False

    url = f"{BASE_URL}/cart/items/{cart_item_id}"
    headers = {"Authorization": f"Bearer {access_token}"}
    data = {"quantity": 3}

    try:
        response = requests.put(url, json=data, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")

        if response.status_code == 200:
            print_success("Cart item quantity updated!")
            return True
        else:
            print_error(f"Failed to update item: {response.json().get('detail')}")
            return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

def test_guest_cart():
    """Test cart operations for guest users"""
    print_test("Guest Cart Operations")

    # Generate guest session ID
    global guest_session_id
    import uuid
    guest_session_id = str(uuid.uuid4())

    # Add item to guest cart
    url = f"{BASE_URL}/cart/add"
    data = {
        "articlenr": "10002",  # Different product
        "quantity": 1,
        "guest_session_id": guest_session_id
    }

    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")

        if response.status_code == 200:
            print_success(f"Guest cart created! Session ID: {guest_session_id}")
            return True
        else:
            print_error(f"Failed to create guest cart: {response.json().get('detail')}")
            return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

def test_clear_cart():
    """Test clearing cart"""
    print_test("Clear Cart")

    url = f"{BASE_URL}/cart/"
    headers = {"Authorization": f"Bearer {access_token}"}

    try:
        response = requests.delete(url, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")

        if response.status_code == 200:
            print_success("Cart cleared successfully!")
            return True
        else:
            print_error(f"Failed to clear cart: {response.json().get('detail')}")
            return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

# ============================================================================
# ORDERS TESTS
# ============================================================================

def test_get_orders():
    """Test getting orders list"""
    print_test("Get Orders List")

    url = f"{BASE_URL}/orders/?skip=0&limit=10"

    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)[:500]}...")  # Truncate for readability

        if response.status_code == 200:
            print_success(f"Retrieved {result.get('count', 0)} orders")
            return True
        else:
            print_error(f"Failed to get orders: {result.get('detail')}")
            return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

def test_get_order_stats():
    """Test getting order statistics"""
    print_test("Get Order Statistics")

    url = f"{BASE_URL}/orders/stats/summary"

    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")

        if response.status_code == 200:
            stats = response.json().get('stats', {})
            print_success(f"Total orders: {stats.get('total_orders', 0)}, Revenue: €{stats.get('total_revenue', 0)}")
            return True
        else:
            print_error(f"Failed to get stats: {response.json().get('detail')}")
            return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

def test_search_orders():
    """Test searching orders"""
    print_test("Search Orders")

    url = f"{BASE_URL}/orders/search?limit=5"

    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)[:500]}...")

        if response.status_code == 200:
            print_success(f"Search returned {result.get('count', 0)} orders")
            return True
        else:
            print_error(f"Search failed: {result.get('detail')}")
            return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

# ============================================================================
# MAIN TEST RUNNER
# ============================================================================

def run_all_tests():
    """Run all API endpoint tests"""
    print(f"\n{Colors.BLUE}{'='*60}")
    print(f"RINOS Bikes API Endpoint Testing")
    print(f"Base URL: {BASE_URL}")
    print(f"Test Email: {TEST_EMAIL}")
    print(f"{'='*60}{Colors.END}\n")

    results = {
        "passed": 0,
        "failed": 0,
        "total": 0
    }

    tests = [
        # Authentication Tests
        ("Register User", test_register),
        ("Login with JSON", test_login_json),
        ("Get Current User", test_get_current_user),

        # Cart Tests
        ("Add to Cart", test_add_to_cart),
        ("View Cart", test_view_cart),
        ("Get Cart Count", test_get_cart_count),
        ("Update Cart Item", test_update_cart_item),
        ("Guest Cart", test_guest_cart),
        ("Clear Cart", test_clear_cart),

        # Orders Tests
        ("Get Orders", test_get_orders),
        ("Get Order Stats", test_get_order_stats),
        ("Search Orders", test_search_orders),
    ]

    for test_name, test_func in tests:
        results["total"] += 1
        try:
            if test_func():
                results["passed"] += 1
            else:
                results["failed"] += 1
        except Exception as e:
            print_error(f"Test crashed: {str(e)}")
            results["failed"] += 1

    # Print summary
    print(f"\n{Colors.BLUE}{'='*60}")
    print(f"TEST SUMMARY")
    print(f"{'='*60}{Colors.END}")
    print(f"Total Tests: {results['total']}")
    print(f"{Colors.GREEN}Passed: {results['passed']}{Colors.END}")
    print(f"{Colors.RED}Failed: {results['failed']}{Colors.END}")
    print(f"Success Rate: {(results['passed']/results['total']*100):.1f}%\n")

if __name__ == "__main__":
    print_info("Starting API endpoint tests...")
    print_info("Make sure your backend is running on the correct port!")
    input("Press Enter to continue...")
    run_all_tests()
