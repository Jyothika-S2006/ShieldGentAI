import uuid

from pydantic import BaseModel
from google.genai import types
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService

from agent import root_agent

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.firestore_service import db

app = FastAPI(
    title="ShieldGent API",
    description="Backend API for ShieldGent fraud detection and incident management.",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173","http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "service": "ShieldGent API",
        "status": "running",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "shieldgent-backend",
    }


@app.get("/incidents")
def get_incidents():
    """
    Return recent ShieldGent incidents from Firestore.
    """

    try:
        docs = (
            db.collection("incidents")
            .order_by("created_at", direction="DESCENDING")
            .limit(50)
            .stream()
        )

        incidents = []

        for doc in docs:
            data = doc.to_dict()
            data["id"] = doc.id
            incidents.append(data)

        return {
            "count": len(incidents),
            "incidents": incidents,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve incidents: {str(e)}",
        )


@app.get("/incidents/{incident_id}")
def get_incident(incident_id: str):
    """
    Return one ShieldGent incident.
    """

    try:
        doc = db.collection("incidents").document(incident_id).get()

        if not doc.exists:
            raise HTTPException(
                status_code=404,
                detail="Incident not found",
            )

        data = doc.to_dict()
        data["id"] = doc.id

        return data

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve incident: {str(e)}",
        )


@app.post("/incidents/{incident_id}/approve")
def approve_incident(incident_id: str):
    """
    Approve a recommended action.
    This does NOT automatically contact authorities or block transactions.
    """

    try:
        doc_ref = db.collection("incidents").document(incident_id)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(
                status_code=404,
                detail="Incident not found",
            )

        doc_ref.update(
            {
                "approval_status": "APPROVED",
            }
        )

        return {
            "success": True,
            "incident_id": incident_id,
            "approval_status": "APPROVED",
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to approve incident: {str(e)}",
        )


@app.post("/incidents/{incident_id}/reject")
def reject_incident(incident_id: str):
    """
    Reject a recommended action.
    """

    try:
        doc_ref = db.collection("incidents").document(incident_id)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(
                status_code=404,
                detail="Incident not found",
            )

        doc_ref.update(
            {
                "approval_status": "REJECTED",
            }
        )

        return {
            "success": True,
            "incident_id": incident_id,
            "approval_status": "REJECTED",
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to reject incident: {str(e)}",
        )

APP_NAME = "shieldgent"
DEMO_USER_ID = "demo-user"

session_service = InMemorySessionService()

runner = Runner(
    agent=root_agent,
    app_name=APP_NAME,
    session_service=session_service,
)


class AnalyzeRequest(BaseModel):
    message: str


@app.post("/analyze")
async def analyze_message(request: AnalyzeRequest):
    session_id = str(uuid.uuid4())
    
    await session_service.create_session(
        app_name=APP_NAME,
        user_id=DEMO_USER_ID,
        session_id=session_id,
    )

    content = types.Content(
        role="user",
        parts=[types.Part(text=request.message)],
    )

    final_text = ""

    async for event in runner.run_async(
        user_id=DEMO_USER_ID,
        session_id=session_id,
        new_message=content,
    ):
        if (
            event.is_final_response()
            and event.content
            and event.content.parts
        ):
            final_text = event.content.parts[0].text

    return {
        "analysis": final_text
    }