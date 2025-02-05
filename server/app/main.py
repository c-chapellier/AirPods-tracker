from datetime import datetime
from pathlib import Path

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .models import AirTag, AirTagResponse

app = FastAPI(title="AirTags Tracker API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Angular dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_airtags_data():
    csv_path = Path(__file__).parents[2] / "gps" / "Airtags.csv"
    try:
        df = pd.read_csv(csv_path)
        # Convert datetime strings to datetime objects
        df['datetime'] = pd.to_datetime(df['datetime'])
        if 'locationtimestamp' in df.columns:
            df['locationtimestamp'] = pd.to_datetime(df['locationtimestamp'])
        
        # Filter out rows with no location data
        df = df.dropna(subset=['locationlatitude', 'locationlongitude'])
        
        # Convert DataFrame to list of AirTag models
        airtags = []
        for _, row in df.iterrows():
            airtag = AirTag(
                datetime=row['datetime'],
                name=row.get('name'),
                serialnumber=row.get('serialnumber'),
                producttype=row.get('producttype'),
                batterystatus=row.get('batterystatus'),
                locationlatitude=row.get('locationlatitude'),
                locationlongitude=row.get('locationlongitude'),
                locationtimestamp=row.get('locationtimestamp'),
                locationhorizontalaccuracy=row.get('locationhorizontalaccuracy'),
                locationverticalaccuracy=row.get('locationverticalaccuracy'),
                addresslabel=row.get('addresslabel'),
                addressstreetaddress=str(row.get('addressstreetaddress')),
                addresslocality=row.get('addresslocality'),
                addresscountry=row.get('addresscountry')
            )
            airtags.append(airtag)
        return airtags
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading data: {str(e)}")

@app.get("/api/airtags", response_model=AirTagResponse)
async def get_airtags():
    """
    Get all AirTag locations from the CSV file
    """
    airtags = load_airtags_data()
    return AirTagResponse(locations=airtags)
