# backend_code/scripts/seed_firestore.py
import firebase_admin
from firebase_admin import credentials, firestore, auth
import os

def seed_firestore_and_auth():
    """
    Seeds the Firestore database and creates corresponding users in Firebase Authentication.
    """
    # Initialize Firebase Admin SDK
    try:
        if not firebase_admin._apps:
            # Explicitly set the project ID to ensure we connect to the correct project.
            project_id = "ai-startup-evaluator-472309"
            cred = credentials.ApplicationDefault()
            firebase_admin.initialize_app(cred, {
                'projectId': project_id,
            })
        
        db = firestore.client()
        print("Successfully connected to Firestore.")

    except Exception as e:
        print(f"Error connecting to Firestore: {e}")
        print("Please ensure your GOOGLE_APPLICATION_CREDENTIALS environment variable is set correctly.")
        return

    users_data = [
        {"uid": "admin-user-01", "email": "admin@example.com", "role": "admin", "status": "active"},
        {"uid": "investor-user-01", "email": "investor1@example.com", "role": "investor", "status": "active"},
        {"uid": "investor-user-02", "email": "investor2@example.com", "role": "investor", "status": "pending"},
        {"uid": "founder-user-01", "email": "founder1@example.com", "role": "founder", "status": "active"},
        {"uid": "founder-user-02", "email": "founder2@example.com", "role": "founder", "status": "inactive"},
    ]

    print("\nStarting to seed Firebase Authentication...")
    for user_data in users_data:
        uid = user_data["uid"]
        email = user_data["email"]
        
        try:
            # Attempt to create the user in Firebase Authentication
            auth.create_user(
                uid=uid,
                email=email,
                email_verified=True,
                password="password" # A default password for local testing
            )
            print(f"Successfully created Auth user for: {email}")
        except auth.EmailAlreadyExistsError:
            print(f"Auth user with email {email} already exists. Skipping creation.")
        except Exception as e:
            print(f"An unexpected error occurred creating Auth user for {email}: {e}")
            continue # Skip to the next user if auth creation fails

    users_collection_ref = db.collection('users')
    print("\nStarting to seed the 'users' collection in Firestore...")
    for user_data in users_data:
        doc_id = user_data["uid"]
        doc_ref = users_collection_ref.document(doc_id)
        
        try:
            # Set the user data in Firestore
            doc_ref.set(user_data)
            print(f"Successfully added/updated Firestore document for UID: {doc_id}")
        except Exception as e:
            print(f"Error adding Firestore document for UID {doc_id}: {e}")

    print("\nFirebase Auth and Firestore have been successfully seeded!")

if __name__ == "__main__":
    seed_firestore_and_auth()
