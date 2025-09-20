# backend_code/dependencies.py
import firebase_admin
from firebase_admin import credentials, firestore, auth
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

# --- Firebase Initialization ---
try:
    if not firebase_admin._apps:
        project_id = "ai-startup-evaluator-472309"
        cred = credentials.ApplicationDefault()
        firebase_admin.initialize_app(cred, {'projectId': project_id})
except Exception as e:
    print(f"Error initializing Firebase Admin SDK: {e}")

# Get a reference to the Firestore database
db = firestore.client()

# --- Security and Authentication Dependencies ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Verifies the Firebase ID token and returns the user's data.
    """
    try:
        decoded_token = auth.verify_id_token(token, check_revoked=True)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Firebase ID token: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )

def require_role(allowed_roles: list[str]):
    """
    A dependency factory that creates a dependency to check for user role and status.
    """
    async def role_checker(current_user: dict = Depends(get_current_user)):
        uid = current_user.get("uid")
        if not uid:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user credentials.")

        try:
            user_doc_ref = db.collection('users').document(uid)
            user_doc = user_doc_ref.get()

            if not user_doc.exists:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User profile not found in database.")
            
            user_data = user_doc.to_dict()
            user_role = user_data.get("role")
            user_status = user_data.get("status")

            if user_status != "active":
                 raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User account is not active.")

            if user_role not in allowed_roles:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to access this resource.")
            
            return user_data
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"An error occurred while verifying user role: {e}")
            
    return role_checker
