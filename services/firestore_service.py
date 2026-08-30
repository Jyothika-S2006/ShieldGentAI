import os
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

load_dotenv()

# Path to Firebase service-account credentials
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CREDENTIAL_PATH = os.path.join(
    BASE_DIR,
    "credentials",
    "firebase-service-account.json"
)

# Initialize Firebase only once
if not firebase_admin._apps:
    cred = credentials.Certificate(CREDENTIAL_PATH)
    firebase_admin.initialize_app(cred)

db = firestore.client()


def save_incident(incident: dict) -> str:
    """
    Save a ShieldGent security incident to Firestore.
    Returns the generated Firestore document ID.
    """

    doc_ref = db.collection("incidents").document()

    incident["created_at"] = firestore.SERVER_TIMESTAMP

    doc_ref.set(incident)

    return doc_ref.id


def get_incident(incident_id: str):
    """
    Retrieve a single incident from Firestore.
    """

    doc = db.collection("incidents").document(incident_id).get()

    if not doc.exists:
        return None

    return doc.to_dict()