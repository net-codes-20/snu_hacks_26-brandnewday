from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import onboarding, voice, restore, friction

app = FastAPI(
    title="HabiTribe AI Service",
    description="The intelligence layer for the HabiTribe app.",
    version="1.0.0"
)

# Enable CORS for the Node.js backend to communicate with us
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the Node.js backend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "HabiTribe AI Service is running!"}

# Include Routers
app.include_router(onboarding.router)
app.include_router(voice.router)
app.include_router(restore.router)
app.include_router(friction.router)
