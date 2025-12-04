"""
Quick script to link existing web_orders with user_id=NULL to a specific user
"""
import sys
sys.path.insert(0, '/Users/franciscojavier/Downloads/rinosbikeat-main-2/backend')

from database.connection import get_db
from models import WebOrder, WebUser

# Get database session
db = next(get_db())

# Find user by email
user_email = "fjgbu@icloud.com"
user = db.query(WebUser).filter(WebUser.email == user_email).first()

if not user:
    print(f"User {user_email} not found!")
    sys.exit(1)

print(f"Found user: {user.email} (ID: {user.user_id})")

# Find orders with no user_id
orders_without_user = db.query(WebOrder).filter(WebOrder.user_id == None).all()

print(f"\nFound {len(orders_without_user)} orders without user_id:")
for order in orders_without_user:
    print(f"  - Order {order.ordernr}: €{order.orderamount}")

# Link them to the user
if orders_without_user:
    confirm = input(f"\nLink these {len(orders_without_user)} orders to {user.email}? (yes/no): ")
    if confirm.lower() == 'yes':
        for order in orders_without_user:
            order.user_id = user.user_id
        db.commit()
        print(f"\n✅ Successfully linked {len(orders_without_user)} orders to {user.email}")
    else:
        print("\nCancelled.")
else:
    print("\nNo orders to link.")

db.close()
