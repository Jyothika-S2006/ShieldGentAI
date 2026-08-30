from services.firestore_service import save_incident

incident = {
    "message": "ShieldGent Firestore connection test",
    "risk_level": "TEST",
    "risk_score": 0,
    "recommended_action": "LOG"
}

incident_id = save_incident(incident)

print("Firestore connection successful!")
print("Incident ID:", incident_id)