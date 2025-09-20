from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth, firestore
import firebase_admin

router = APIRouter()
security = HTTPBearer()

# Initialize Firebase Admin SDK if it hasn't been already
if not firebase_admin._apps:
    firebase_admin.initialize_app()

db = firestore.client()

@router.post("/google-signin")
async def google_signin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Handles Google sign-in. It verifies the Firebase ID token, checks for an existing
    user record in Firestore to determine their role, and sets custom claims.
    If the user is new, it creates a record for them with a default role.
    """
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token["uid"]
        email = decoded_token.get("email")

        users_ref = db.collection('users')
        user_doc = users_ref.document(uid).get()

        role = ""
        # Check if the user exists in Firestore
        if user_doc.exists:
            print(f"User {email} found in Firestore. Assigning role from DB.")
            user_data = user_doc.to_dict()
            role = user_data.get("role", "founder") # Default to 'founder' if role field is missing
        else:
            # If user is new, create a document for them
            print(f"User {email} is new. Creating a record in Firestore with 'founder' role.")
            role = "founder"
            new_user_data = {
                "email": email,
                "role": role,
                "status": "active",
                "uid": uid,
                "createdAt": firestore.SERVER_TIMESTAMP
            }
            users_ref.document(uid).set(new_user_data)

        # Set custom claims on the user's auth token
        auth.set_custom_user_claims(uid, {"role": role})

        return {"status": "success", "message": f"Custom claim '{role}' set for user {uid}"}

    except Exception as e:
        print(f"Error during Google sign-in process: {e}")
        raise HTTPException(status_code=401, detail=f"Invalid token or Firestore error: {e}")
