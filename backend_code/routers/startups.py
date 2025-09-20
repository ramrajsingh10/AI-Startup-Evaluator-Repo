# backend_code/routers/startups.py
from fastapi import APIRouter, Depends, HTTPException, status
from ..main import db, require_role
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class Startup(BaseModel):
    name: str
    description: str
    website: Optional[str] = None
    founder_uid: str

@router.post("/startups", status_code=status.HTTP_201_CREATED)
async def create_startup(startup: Startup, current_user: dict = Depends(require_role(["founder"]))):
    """
    Creates a new startup in the Firestore 'startups' collection.
    Only accessible by users with the 'founder' role.
    """
    try:
        # Ensure the founder is submitting their own startup
        if startup.founder_uid != current_user.get("uid"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only submit a startup for your own account."
            )
        
        startups_ref = db.collection('startups')
        new_startup_ref = startups_ref.document()
        new_startup_ref.set(startup.dict())
        return {"id": new_startup_ref.id, **startup.dict()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while creating the startup: {e}"
        )

@router.get("/founder/dashboard")
async def get_founder_dashboard(current_user: dict = Depends(require_role(["founder"]))):
    """
    Fetches dashboard data for the logged-in founder, including their startup.
    """
    try:
        uid = current_user.get("uid")
        startups_ref = db.collection('startups').where('founder_uid', '==', uid).limit(1)
        docs = startups_ref.stream()
        
        startup_data = None
        for doc in docs:
            startup_data = doc.to_dict()
            startup_data['id'] = doc.id

        # Mock data for memos and investor interest
        memos = []
        investor_interest = []

        return {
            "startup": startup_data,
            "memos": memos,
            "investor_interest": investor_interest
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching founder dashboard data: {e}"
        )

@router.get("/startups/{startup_id}")
async def get_startup(startup_id: str, current_user: dict = Depends(require_role(["investor", "admin"]))):
    """
    Fetches a specific startup from the Firestore 'startups' collection.
    Only accessible by users with 'investor' or 'admin' roles.
    """
    try:
        startup_ref = db.collection('startups').document(startup_id)
        startup_doc = startup_ref.get()

        if not startup_doc.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Startup not found.",
            )
        
        return {"id": startup_doc.id, **startup_doc.to_dict()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching the startup: {e}"
        )
