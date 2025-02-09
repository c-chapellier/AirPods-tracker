from datetime import datetime
from pathlib import Path
from typing import List

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .models import Location

app = FastAPI(title="AirTags Tracker API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",  # Angular dev server
        "https://c-chapellier.github.io"  # GitHub Pages domain
    ],
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

def mock_data():
    return [
        Location(
            datetime=datetime.now(),
            name="AirTag 1",
            serialnumber="12345678",
            producttype="AirTag",
            batterystatus=100,
            locationlatitude=49.123456,
            locationlongitude=5.123456,
            locationtimestamp=datetime.now(),
            locationhorizontalaccuracy=10,
            locationverticalaccuracy=10,
            addresslabel="Home",
            addressstreetaddress="Rue du Gouffon",
            addresslocality="Lille",
            addresscountry="France"
        ),
        Location(
            datetime=datetime.now(),
            name="AirTag 2",
            serialnumber="12345679",
            producttype="AirTag",
            batterystatus=100,
            locationlatitude=49.123457,
            locationlongitude=5.123457,
            locationtimestamp=datetime.now(),
            locationhorizontalaccuracy=10,
            locationverticalaccuracy=10,
            addresslabel="Home",
            addressstreetaddress="Rue du Gouffon",
            addresslocality="Lille",
            addresscountry="France"
        ),
        Location(
            datetime=datetime.now(),
            name="AirTag 3",
            serialnumber="12345680",
            producttype="AirTag",
            batterystatus=100,
            locationlatitude=49.123458,
            locationlongitude=5.123458,
            locationtimestamp=datetime.now(),
            locationhorizontalaccuracy=10,
            locationverticalaccuracy=10,
            addresslabel="Home",
            addressstreetaddress="Rue du Gouffon",
            addresslocality="Lille",
            addresscountry="France"
        ),
        Location(
            datetime=datetime(2024, 6, 23),
            name="AirTag 1",
            serialnumber="12345678",
            producttype="AirTag",
            batterystatus=100,
            locationlatitude=49.223456,
            locationlongitude=5.223456,
            locationtimestamp=datetime.now(),
            locationhorizontalaccuracy=10,
            locationverticalaccuracy=10,
            addresslabel="Home",
            addressstreetaddress="Rue du Gouffon",
            addresslocality="Lille",
            addresscountry="France"
        ),
        Location(
            datetime=datetime(2024, 6, 24),
            name="AirTag 1",
            serialnumber="12345678",
            producttype="AirTag",
            batterystatus=100,
            locationlatitude=49.323456,
            locationlongitude=5.323456,
            locationtimestamp=datetime.now(),
            locationhorizontalaccuracy=10,
            locationverticalaccuracy=10,
            addresslabel="Home",
            addressstreetaddress="Rue du Gouffon",
            addresslocality="Lille",
            addresscountry="France"
        ),
        Location(
            datetime=datetime(2024, 6, 25),
            name="AirTag 1",
            serialnumber="12345678",
            producttype="AirTag",
            batterystatus=100,
            locationlatitude=49.223456,
            locationlongitude=5.53456,
            locationtimestamp=datetime.now(),
            locationhorizontalaccuracy=10,
            locationverticalaccuracy=10,
            addresslabel="Home",
            addressstreetaddress="Rue du Gouffon",
            addresslocality="Lille",
            addresscountry="France"
        )
    ]

@app.get("/api/locations", response_model=List[Location])
async def get_locations():
    """
    Get all locations from the CSV file
    """
    # airtags = load_airtags_data()
    locations = mock_data()
    return locations
