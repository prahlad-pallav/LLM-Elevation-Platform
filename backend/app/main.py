# Import FastAPI framework
from fastapi import FastAPI

# Import API route modules for handling dataset uploads and LLM evaluations
from app.routes import datasets, evaluation

from fastapi.middleware.cors import CORSMiddleware

# Create FastAPI application instance
app = FastAPI()

# Allow CORS for frontend (React running on http://localhost:3000)
app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:3000"],  # Adjust for production
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


# Include dataset management routes under the "/datasets" prefix
# This will handle file uploads, parsing, and validation
app.include_router(datasets.router, prefix="/datasets", tags=["Dataset Management"])

# Include LLM evaluation routes under the "/evaluation" prefix
# This will handle processing prompts and querying multiple LLMs
app.include_router(evaluation.router, prefix="/evaluation", tags=["LLM Evaluation"])

# Define a root endpoint to verify if the API is running
@app.get("/")
def read_root():
    return {"message": "LLM Evaluation Platform API"}
