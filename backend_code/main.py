import firebase_admin
from firebase_admin import credentials, firestore
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from firebase_admin import auth
from fastapi.middleware.cors import CORSMiddleware


# Load the service account key and initialize the Firebase Admin SDK
# The SDK automatically finds the credentials file via the GOOGLE_APPLICATION_CREDENTIALS environment variable
cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred)

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


@app.get("/")
def read_root():
    return {"message": "Welcome to the backend! API is running."}


# This is a protected endpoint. It can only be accessed by authenticated users.
@app.get("/api/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    """
    Returns the data of the currently authenticated user.
    """
    # The 'current_user' object is the decoded token, which contains user info
    return {"uid": current_user.get("uid"), "email": current_user.get("email")}

@app.get("/api/startups")
async def get_startups(current_user: dict = Depends(get_current_user)):
    """
    Fetches a list of all startups from the Firestore 'startups' collection.
    This is a protected endpoint.
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
