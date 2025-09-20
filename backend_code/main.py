import firebase_admin
from firebase_admin import credentials, firestore
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from firebase_admin import auth
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth as auth_router, startups as startups_router, memos as memos_router


# Load the service account key and initialize the Firebase Admin SDK
# The SDK automatically finds the credentials file via the GOOGLE_APPLICATION_CREDENTIALS environment variable
try:
    if not firebase_admin._apps:
        project_id = "ai-startup-evaluator-472309"
        cred = credentials.ApplicationDefault()
        firebase_admin.initialize_app(cred, {'projectId': project_id})
except Exception as e:
    print(f"Error initializing Firebase Admin SDK: {e}")

# Get a reference to the Firestore database
db = firestore.client()

app = FastAPI()

# A placeholder for our token authentication scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Add CORS middleware to allow the frontend (running on a different port) to call the backend
# This is crucial for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, you would restrict this to your frontend's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router, prefix="/api/v1/auth")
app.include_router(startups_router.router, prefix="/api")
app.include_router(memos_router.router, prefix="/api")


# Dependency to verify the Firebase ID token
async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Verifies the Firebase ID token and returns the user's data.
    If the token is invalid, it raises an HTTP exception.
    """
    try:
        # The check_revoked flag is important for security
        decoded_token = auth.verify_id_token(token, check_revoked=True)
        return decoded_token
    except Exception as e:
        # Catch any other Firebase admin errors
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Firebase ID token: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )

# New Dependency Factory for Role-Based Access Control
def require_role(allowed_roles: list[str]):
    """
    A dependency factory that creates a dependency to check for user role and status.
    It verifies that the user has one of the allowed roles and is 'active'.
    """
    async def role_checker(current_user: dict = Depends(get_current_user)):
        uid = current_user.get("uid")
        if not uid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate user credentials.",
            )

        try:
            user_doc_ref = db.collection('users').document(uid)
            user_doc = user_doc_ref.get()

            if not user_doc.exists:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="User profile not found in database.",
                )
            
            user_data = user_doc.to_dict()
            user_role = user_data.get("role")
            user_status = user_data.get("status")

            if user_status != "active":
                 raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="User account is not active.",
                )

            if user_role not in allowed_roles:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You do not have permission to access this resource.",
                )
            
            # Return the full user profile from Firestore, which is more useful
            return user_data
        except HTTPException as e:
            # Re-raise HTTP exceptions to avoid masking them
            raise e
        except Exception as e:
            # Catch any other potential errors during Firestore fetch
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"An error occurred while verifying user role: {e}"
            )
            
    return role_checker


@app.get("/")
def read_root():
    return {"message": "Welcome to the backend! API is running."}


# This is a protected endpoint. It can only be accessed by authenticated users.
@app.get("/api/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    """
    Returns the data of the currently authenticated user from their token.
    """
    return {"uid": current_user.get("uid"), "email": current_user.get("email")}

# SECURED ENDPOINT: Only active admins or investors can access this.
@app.get("/api/startups")
async def get_startups(current_user_profile: dict = Depends(require_role(["admin", "investor"]))):
    """
    Fetches a list of all startups from the Firestore 'startups' collection.
    This endpoint is now protected and only accessible by users with 'admin' or 'investor' roles
    and an 'active' status.
    """
    try:
        startups_ref = db.collection('startups')
        docs = startups_ref.stream()

        startups = []
        for doc in docs:
            startup_data = doc.to_dict()
            startup_data['id'] = doc.id
            startups.append(startup_data)
            
        return startups
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching startups: {e}"
        )