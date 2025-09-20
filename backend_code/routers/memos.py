# backend_code/routers/memos.py
from fastapi import APIRouter, Depends, HTTPException, status
from ..main import db, require_role

router = APIRouter()

@router.get("/memos/{memo_id}")
async def get_memo(memo_id: str, current_user: dict = Depends(require_role(["investor", "admin"]))):
    """
    Fetches a specific memo from the Firestore 'memos' collection.
    Only accessible by users with 'investor' or 'admin' roles.
    """
    try:
        memo_ref = db.collection('memos').document(memo_id)
        memo_doc = memo_ref.get()

        if not memo_doc.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Memo not found.",
            )
        
        return {"id": memo_doc.id, **memo_doc.to_dict()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching the memo: {e}"
        )
