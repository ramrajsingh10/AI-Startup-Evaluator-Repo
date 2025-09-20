# backend_code/main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth as auth_router, startups as startups_router, memos as memos_router
from .dependencies import get_current_user, require_role, db

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router.router, prefix="/api/v1/auth")
app.include_router(startups_router.router, prefix="/api")
app.include_router(memos_router.router, prefix="/api")

# --- API Endpoints defined in main.py ---

@app.get("/")
def read_root():
    return {"message": "Welcome to the backend! API is running."}

@app.get("/api/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    """
    Returns the data of the currently authenticated user from their token.
    """
    return {"uid": current_user.get("uid"), "email": current_user.get("email")}

@app.get("/api/startups")
async def get_startups(current_user_profile: dict = Depends(require_role(["admin", "investor"]))):
    """
    Fetches a list of all startups from the Firestore 'startups' collection.
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
