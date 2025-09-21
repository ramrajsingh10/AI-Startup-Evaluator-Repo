from fastapi import APIRouter, Depends, HTTPException, Body
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth, firestore
import firebase_admin

router = APIRouter()
security = HTTPBearer()

# Initialize Firebase Admin SDK if it hasn't been already
if not firebase_admin._apps:
    firebase_admin.initialize_app()

db = firestore.client()

@router.post("/signup")
async def signup(email: str = Body(...), password: str = Body(...), role: str = Body(...)):
    """
    Handles new user sign-up. Creates a user in Firebase Auth and a corresponding
    document in Firestore with an 'active' status (temporarily for demo).
    """
    if role not in ["founder", "investor"]:
        raise HTTPException(status_code=400, detail="Invalid role specified.")

    try:
        # Create user in Firebase Authentication
        new_user = auth.create_user(email=email, password=password)
        uid = new_user.uid

        # Create user document in Firestore with 'active' status (TEMPORARY)
        users_ref = db.collection('users')
        new_user_data = {
            "email": email,
            "role": role,
            "status": "active",  # TEMPORARY: New users start as active for demo
            "uid": uid,
            "createdAt": firestore.SERVER_TIMESTAMP
        }
        users_ref.document(uid).set(new_user_data)

        # Set a custom claim to identify the user's role
        auth.set_custom_user_claims(uid, {"role": role})

        return {"status": "success", "message": "Signup successful. You can now log in."}

    except auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=409, detail="A user with this email already exists.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")


@router.post("/google-signin")
async def google_signin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Handles Google sign-in. It verifies the Firebase ID token, checks for an existing
    user record in Firestore to determine their role and status, and sets custom claims.
    If the user is new, it creates an 'active' record for them (temporarily for demo).
    """
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token["uid"]
        email = decoded_token.get("email")

        users_ref = db.collection('users')
        user_doc = users_ref.document(uid).get()

        role = ""
        status = ""
        # Check if the user exists in Firestore
        if user_doc.exists:
            user_data = user_doc.to_dict()
            role = user_data.get("role", "founder")
            status = user_data.get("status", "active") # TEMPORARY: Default to active for existing users
        else:
            # If user is new, create a document for them with 'active' status (TEMPORARY)
            role = "founder"  # Default role for new Google sign-ups
            status = "active"
            new_user_data = {
                "email": email,
                "role": role,
                "status": status,
                "uid": uid,
                "createdAt": firestore.SERVER_TIMESTAMP
            }
            users_ref.document(uid).set(new_user_data)

        # TEMPORARILY COMMENTED OUT FOR DEMO:
        # if status != "active":
        #     raise HTTPException(status_code=403, detail="Account is not active. Please wait for admin approval.")

        # Set custom claims on the user's auth token
        auth.set_custom_user_claims(uid, {"role": role})

        return {"status": "success", "message": f"Custom claim '{role}' set for user {uid}"}

    except HTTPException as e:
        # Re-raise HTTPException to preserve status code and detail
        raise e
    except Exception as e:
        print(f"Error during Google sign-in process: {e}")
        raise HTTPException(status_code=401, detail=f"Invalid token or Firestore error: {e}")
