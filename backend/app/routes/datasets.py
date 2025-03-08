# Import FastAPI's APIRouter for defining API routes
from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import io

# Create a router instance to manage dataset-related endpoints
router = APIRouter()

# Define an endpoint to handle CSV file uploads
@router.post("/upload/")
async def upload_csv(file: UploadFile = File(...)):
    """
    Upload a CSV file, parse its contents, and return column names along with data records.

    Parameters:
    - file (UploadFile): The uploaded CSV file.

    Returns:
    - A dictionary containing:
        - "columns": A list of column names in the CSV.
        - "rows": A list of lists, where each inner list represents a row of data.
    """

    try:
        # Read file content
        contents = await file.read()

        # Decode and convert into Pandas DataFrame
        df = pd.read_csv(io.StringIO(contents.decode("utf-8")), encoding_errors="ignore")

        # Return structured response
        return {"columns": df.columns.tolist(), "rows": df.values.tolist()}

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid dataset format: {str(e)}")
